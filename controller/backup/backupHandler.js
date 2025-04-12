const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const archiver = require("archiver");
const path = require("path");
const fs = require("fs");

// Define the assets folder path
const assetsDir = path.join(__dirname, "../../assets");
// Define the backup directory for the database
const backupDir = path.join(__dirname, "./db_backup");


// Ensure the directories exist
if (!fs.existsSync(assetsDir)) {
    console.error("Assets directory not found");
}
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// Combined backup endpoint (DB + Assets)
router.get(`/backup_full/${process.env.BACKUP_URL_NAME}`, (req, res) => {
    const dateSuffix = new Date().toISOString().split('T')[0];
    const dbBackupFileName = `db-backup-${dateSuffix}.gz`;
    const dbBackupFilePath = path.join(backupDir, dbBackupFileName);
    const combinedBackupFileName = `full-backup-${dateSuffix}.zip`;
    const combinedBackupFilePath = path.join(backupDir, combinedBackupFileName);



    // Modify the command to specify the database name
    const dumpCommand = `mongodump --db=${process.env.DBNAME} --archive=${dbBackupFilePath} --gzip  --username "${process.env.DBUSERNAME}" --password "${process.env.DBPASSWORD}" --authenticationDatabase ${process.env.DBAUTHSOURCE} --authenticationMechanism SCRAM-SHA-256`;
    //

    exec(dumpCommand, (err, stdout, stderr) => {
        if (err) {
            console.error("Error creating database backup:", err);
            return res.status(500).json({ message: "Error creating database backup", error: err.message });
        }

        console.log("Database backup created successfully:", stdout);

        // Now create a ZIP file that includes both the MongoDB backup and the assets folder
        const output = fs.createWriteStream(combinedBackupFilePath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        // Handle stream events
        output.on("close", () => {
            console.log(`${archive.pointer()} total bytes`);
            console.log("Full backup (DB + Assets) created successfully");

            // Return the zip file as a response for download
            res.download(combinedBackupFilePath, combinedBackupFileName, (err) => {
                if (err) {
                    console.error("Error sending combined backup file:", err);
                    res.status(500).json({ message: "Error sending combined backup file", error: err.message });
                }
            });
        });

        archive.on("error", (err) => {
            throw err;
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Append the MongoDB backup to the ZIP
        archive.file(dbBackupFilePath, { name: dbBackupFileName });

        // Append the assets directory to the ZIP
        archive.directory(assetsDir, "assets");

        // Finalize the archive (finish the compression)
        archive.finalize();
    });
});

module.exports = router;
