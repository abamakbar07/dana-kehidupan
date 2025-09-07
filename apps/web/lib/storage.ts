export interface StorageAdapter {
  put(objectKey: string, data: Buffer | Uint8Array, contentType: string): Promise<string>; // returns URL
  delete(objectKey: string): Promise<void>;
}

export class LocalStorageAdapter implements StorageAdapter {
  // Dev-only: store in /public/uploads
  async put(objectKey: string, data: Buffer | Uint8Array): Promise<string> {
    const fs = await import("fs/promises");
    const path = await import("path");
    const dir = path.join(process.cwd(), "apps/web/public/uploads");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, objectKey);
    await fs.writeFile(file, data);
    return `/uploads/${objectKey}`;
  }
  async delete(objectKey: string): Promise<void> {
    const fs = await import("fs/promises");
    const path = await import("path");
    const file = path.join(process.cwd(), "apps/web/public/uploads", objectKey);
    await fs.rm(file, { force: true });
  }
}

export class MockCloudStorageAdapter implements StorageAdapter {
  async put(objectKey: string): Promise<string> {
    return `https://mock-storage.local/${objectKey}`;
  }
  async delete(): Promise<void> {}
}

