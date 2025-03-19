import { Client } from "ssh2";

/**
 * Establish SSH Connection
 */
export const connectSSH = (ipAddress, username, privateKey, io, socketId) => {
    return new Promise((resolve, reject) => {
        const ssh = new Client();

        ssh.on("ready", () => {
            resolve(ssh);
        });

        ssh.on("error", (err) => {
            console.error(`❌ SSH Connection Error: ${err.message}`);
            if (io && socketId) {
                io.to(socketId).emit("deployment-progress", { step: `❌ SSH Connection Failed: ${err.message}`, success: false });
            }
            reject(`SSH Connection Error: ${err.message}`);
        });

        ssh.connect({ host: ipAddress, username, privateKey, readyTimeout: 5000 });
    });
};

/**
 * Execute a command via SSH
 */
export const executeCommand = (ssh, command) => {
    return new Promise((resolve, reject) => {
        ssh.exec(command, (err, stream) => {
            if (err) return reject(`Command Execution Error: ${err.message}`);
            let output = "";
            stream.on("data", (data) => (output += data.toString()));
            stream.on("close", () => resolve(output.trim()));
        });
    });
};

/**
 * Close SSH Connection
 */
export const closeSSH = (ssh) => {
    if (ssh) {
        ssh.end();
    }
};
