import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export default cloudinary;

/**
 * Upload a file (base64 data URI or remote URL) to Cloudinary.
 * Returns the secure URL and public_id of the uploaded asset.
 */
export async function uploadToCloudinary(
    file: string,
    options: {
        folder?: string;
        publicId?: string;
        transformation?: object[];
    } = {}
): Promise<{ url: string; publicId: string }> {
    const result = await cloudinary.uploader.upload(file, {
        folder: options.folder ?? "prepmate",
        public_id: options.publicId,
        overwrite: true,
        transformation: options.transformation,
        resource_type: "auto",
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
}

/**
 * Delete an asset from Cloudinary by its public_id.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

/**
 * Build an optimised Cloudinary URL for a profile avatar.
 * Resizes to a square and applies auto-quality/format.
 */
export function getAvatarUrl(publicId: string, size = 128): string {
    return cloudinary.url(publicId, {
        width: size,
        height: size,
        crop: "fill",
        gravity: "face",
        quality: "auto",
        fetch_format: "auto",
        secure: true,
    });
}
