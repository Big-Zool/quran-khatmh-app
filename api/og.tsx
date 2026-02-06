import { ImageResponse } from '@vercel/og';
// No need to import Request, it's global in the Edge Runtime


export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name') ?? 'فاعل خير';

        // Fetch the Arabic font for proper rendering
        // We use IBM Plex Sans Arabic for a modern feel
        const fontData = await fetch(
            new URL('https://github.com/google/fonts/raw/main/ofl/ibmplexsansarabic/IBMPlexSansArabic-Bold.ttf', import.meta.url)
        ).then((res) => res.arrayBuffer());

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #115e59 0%, #064e3b 100%)',
                        color: 'white',
                        padding: '40px',
                        textAlign: 'center',
                        fontFamily: 'IBMPlexSansArabic',
                        position: 'relative',
                    }}
                >
                    {/* Decorative Islamic Geometric Pattern Overlay (Simulated) */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0.1,
                            display: 'flex',
                            flexWrap: 'wrap',
                            overflow: 'hidden',
                            pointerEvents: 'none',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {/* Simple pattern of stars or dots */}
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} style={{ width: '150px', height: '150px', border: '1px solid white', margin: '10px', transform: 'rotate(45deg)' }} />
                        ))}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            zIndex: 10,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 64,
                                marginBottom: 10,
                                opacity: 0.9,
                                fontWeight: 400,
                                color: '#ccfbf1',
                            }}
                        >
                            {name}
                        </div>

                        <div
                            style={{
                                fontSize: 110,
                                fontWeight: 'bold',
                                textShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                display: 'flex',
                            }}
                        >
                            صدقة جارية
                        </div>

                        <div
                            style={{
                                marginTop: 20,
                                width: '100px',
                                height: '4px',
                                background: '#5eead4',
                                borderRadius: '2px',
                                opacity: 0.6
                            }}
                        />
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: 40,
                            left: 40,
                            right: 40,
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: 24,
                            opacity: 0.6,
                            color: '#99f6e4',
                            letterSpacing: '2px',
                        }}
                    >
                        KHATM.APP
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'IBMPlexSansArabic',
                        data: fontData,
                        style: 'normal',
                    },
                ],
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
