import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL!;
    const { token } = params;

    return {
        openGraph: {
            title: "My Ledger – Invitation",
            description: "Join My Ledger and manage credits & debits seamlessly.",
            url: `${baseUrl}/invite/${token}`,
            images: [
                {
                    url: `${baseUrl}/og-image.png`,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            images: [`${baseUrl}/og-image.png`],
        },
    };
}
