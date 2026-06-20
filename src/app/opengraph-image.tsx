import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Vito Piccolini - AI & Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(to bottom right, #04060C, #1A1A24)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #a1a1aa)', backgroundClip: 'text', color: 'transparent' }}>
            Vito Piccolini
          </h1>
          <p style={{ marginTop: 24, fontSize: 32, color: '#a1a1aa', fontWeight: 500 }}>
            AI & Software Engineer
          </p>
          <div style={{ marginTop: 48, display: 'flex', gap: 24, fontSize: 24, color: '#71717a' }}>
            <span>TypeScript</span>
            <span>·</span>
            <span>React</span>
            <span>·</span>
            <span>Python</span>
            <span>·</span>
            <span>RAG</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
