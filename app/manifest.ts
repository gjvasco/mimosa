import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Mimosa Alelí",
        short_name: "Mimosa Alelí",
        description:
            "Bisutería, velas aromáticas y aceites esenciales",
        start_url: "/productos",
        display: "standalone",
        background_color: "#fffafc",
        theme_color: "#6f4656",
        orientation: "portrait",
        icons: [
            {
                src: "/mimosa-aleli-logo.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}