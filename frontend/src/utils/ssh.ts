// src/utils/ssh.ts
/**
 * SSH integration utilities
 * 
 * This file contains utility functions for SSH command generation
 * and parsers for command-line usage of the SDROP application.
 */

// Base API URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://sdrop.io/api'

/**
 * Generate an SSH command for uploading a file
 */
export const generateUploadCommand = (options: {
  filePath?: string
  password?: string
  expiry?: number
} = {}) => {
  const {
    filePath = 'path/to/file',
    password = 'your-password',
    expiry = 7
  } = options
  
  return `curl -X POST ${API_BASE}/upload \\
  -F "file=@${filePath}" \\
  -F "password=${password}" \\
  -F "expiry=${expiry}"`
}

/**
 * Generate an SSH command for downloading a file
 */
export const generateDownloadCommand = (options: {
  fileId: string
  password?: string
  outputPath?: string
}) => {
  const {
    fileId,
    password = 'your-password',
    outputPath = 'output-file'
  } = options
  
  return `curl -X POST ${API_BASE}/files/${fileId}/download \\
  -H "Content-Type: application/json" \\
  -d '{"password":"${password}"}' \\
  -o ${outputPath}`
}

/**
 * Generate a shell script to install SDROP CLI
 */
export const generateInstallScript = () => {
  return `#!/bin/bash
  
# SDROP CLI installer
echo "Installing SDROP CLI..."

# Create ~/.sdrop directory
mkdir -p ~/.sdrop

# Download CLI script
curl -o ~/.sdrop/sdrop https://sdrop.io/cli/sdrop
chmod +x ~/.sdrop/sdrop

# Add to PATH if not already there
if [[ ":$PATH:" != *":$HOME/.sdrop:"* ]]; then
  echo 'export PATH="$HOME/.sdrop:$PATH"' >> ~/.bashrc
  echo 'export PATH="$HOME/.sdrop:$PATH"' >> ~/.zshrc
  echo "Added ~/.sdrop to PATH"
fi

echo "SDROP CLI installed successfully!"
echo "Please restart your terminal or run 'source ~/.bashrc' to use the 'sdrop' command."
`
}

/**
 * Generate sample CLI usage examples
 */
export const getCliUsageExamples = () => {
  return [
    {
      title: 'Upload a file',
      command: 'sdrop upload file.pdf'
    },
    {
      title: 'Upload with custom password',
      command: 'sdrop upload file.pdf --password mysecretpassword'
    },
    {
      title: 'Upload with expiry (days)',
      command: 'sdrop upload file.pdf --expiry 14'
    },
    {
      title: 'Download a file',
      command: 'sdrop download abc123 --password secretpassword'
    },
    {
      title: 'Get file info',
      command: 'sdrop info abc123'
    }
  ]
}

/**
 * Generate a Node.js script for programmatic access
 */
export const generateNodeJsExample = () => {
  return `// SDROP Node.js example
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Upload a file
async function uploadFile(filePath, password, expiry = 7) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('password', password);
  form.append('expiry', expiry);

  try {
    const response = await axios.post('${API_BASE}/upload', form, {
      headers: form.getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    throw error;
  }
}

// Download a file
async function downloadFile(fileId, password, outputPath) {
  try {
    const response = await axios.post(
      \`${API_BASE}/files/\${fileId}/download\`,
      { password },
      { responseType: 'stream' }
    );
    
    response.data.pipe(fs.createWriteStream(outputPath));
    
    return new Promise((resolve, reject) => {
      response.data.on('end', () => resolve());
      response.data.on('error', err => reject(err));
    });
  } catch (error) {
    console.error('Download error:', error.response?.data || error.message);
    throw error;
  }
}

// Example usage
async function example() {
  try {
    // Upload
    const uploadResult = await uploadFile('example.pdf', 'mysecretpassword');
    console.log('File uploaded:', uploadResult);
    
    // Download
    await downloadFile(uploadResult.fileId, 'mysecretpassword', 'downloaded-file.pdf');
    console.log('File downloaded successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

example();
`
}

/**
 * Generate a Python script for programmatic access
 */
export const generatePythonExample = () => {
  return `# SDROP Python example
import requests
import os

# Upload a file
def upload_file(file_path, password, expiry=7):
    with open(file_path, 'rb') as file:
        files = {'file': file}
        data = {
            'password': password,
            'expiry': expiry
        }
        
        response = requests.post('${API_BASE}/upload', files=files, data=data)
        response.raise_for_status()
        return response.json()

# Download a file
def download_file(file_id, password, output_path):
    response = requests.post(
        f'${API_BASE}/files/{file_id}/download',
        json={'password': password},
        stream=True
    )
    response.raise_for_status()
    
    with open(output_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)

# Example usage
def example():
    try:
        # Upload
        upload_result = upload_file('example.pdf', 'mysecretpassword')
        print(f"File uploaded: {upload_result}")
        
        # Download
        download_file(upload_result['fileId'], 'mysecretpassword', 'downloaded-file.pdf')
        print("File downloaded successfully")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    example()
`
}