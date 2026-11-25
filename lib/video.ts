import 'server-only';
import crypto from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { config } from './config';
import type { CurrentUser } from './auth';

/**
 * Video delivery is provider-agnostic. Every playback starts with an access check on the server,
 * then the provider issues a short-lived, user-bound credential:
 *
 *  - demo      : signed 10-minute stream URL served by our own API (bound to the viewer's session).
 *  - vdocipher : DRM (Widevine / FairPlay) OTP + dynamic watermark. Blocks downloaders and most screen recorders.
 *  - bunny     : Bunny Stream token-authenticated embed URL (enable MediaCage DRM in the Bunny dashboard).
 */
export type Playback =
  | { type: 'html5'; src: string; watermark: string }
  | { type: 'vdocipher'; otp: string; playbackInfo: string; watermark: string }
  | { type: 'iframe'; src: string; watermark: string };

const TTL_SEC = 10 * 60;

export function watermarkFor(user: CurrentUser | null) {
  return user ? `${user.email} · ${user.id.slice(-6).toUpperCase()}` : 'bulls2bear.com · free preview';
}

export async function issuePlayback(chapter: { id: string; videoId: string; isFree: boolean }, user: CurrentUser | null): Promise<Playback> {
  const watermark = watermarkFor(user);

  if (config.videoProvider === 'vdocipher') {
    const res = await fetch(`https://dev.vdocipher.com/api/videos/${encodeURIComponent(chapter.videoId)}/otp`, {
      method: 'POST',
      headers: { Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ttl: 300,
        annotate: JSON.stringify([{ type: 'rtext', text: watermark, alpha: '0.45', color: '0xFFFFFF', size: '14', interval: '5000' }]),
      }),
    });
    if (!res.ok) throw new Error(`VdoCipher OTP failed: ${res.status}`);
    const d = (await res.json()) as { otp: string; playbackInfo: string };
    return { type: 'vdocipher', otp: d.otp, playbackInfo: d.playbackInfo, watermark };
  }

  if (config.videoProvider === 'bunny') {
    const expires = Math.floor(Date.now() / 1000) + TTL_SEC;
    const token = crypto.createHash('sha256').update(`${process.env.BUNNY_TOKEN_KEY}${chapter.videoId}${expires}`).digest('hex');
    return {
      type: 'iframe', watermark,
      src: `https://iframe.mediadelivery.net/embed/${process.env.BUNNY_LIBRARY_ID}/${chapter.videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true`,
    };
  }

  // demo provider
  const token = await new SignJWT({ cid: chapter.id, sid: user?.sessionId ?? null })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience('video')
    .setExpirationTime(`${TTL_SEC}s`)
    .sign(config.authSecret());
  return { type: 'html5', src: `/api/video/stream/${chapter.id}?t=${token}`, watermark };
}

export async function verifyStreamToken(token: string) {
  const { payload } = await jwtVerify(token, config.authSecret(), { audience: 'video' });
  return payload as { cid: string; sid: string | null };
}
