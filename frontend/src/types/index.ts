/**
 * File metadata interface
 */
export interface FileMetadata {
  id: string
  name: string
  size: number
  type: string
  createdAt: Date
  expiresAt?: Date
  requiresPassword: boolean
  downloadCount: number
}

/**
 * Upload response interface
 */
export interface UploadResponse {
  fileId: string
  url: string
  expiresAt?: Date
}

/**
 * Download options interface
 */
export interface DownloadOptions {
  fileId: string
  password?: string
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  darkMode: boolean
  primaryColor: string
  accentColor: string
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  theme: ThemeConfig
  defaultExpiration: number // days
  autoGeneratePassword: boolean
}

/**
 * SSH command configuration
 */
export interface SSHCommandConfig {
  host: string
  user: string
  port: number
  command: string
}
