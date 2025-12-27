/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [process.env.NEXT_PUBLIC_API_URL],
        },
    },
};

export default nextConfig;
