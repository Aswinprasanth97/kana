# assets/audio/

## Add your own song (optional)

Drop an MP3 here named exactly:

```text
assets/audio/wedding-song.mp3
```

The player picks it up automatically — no code change. It loops, fades in and
out, and never plays until a guest presses the music button.

**If this file is absent, the site still has music.** It falls back to a soft
generative ambience synthesised in the browser (Web Audio): a tanpura-style
drone under slow plucked notes drawn from *Mohanam*, the pentatonic scale most
Kerala temple music sits in. It never repeats, downloads nothing, and has no
licensing problem — so the button works out of the box.

## ⚠️ Please use a track you have the rights to

A wedding invitation is a public web page. Putting a film song or any
commercial recording on it is copyright infringement, and hosts do take pages
down for it. Safe options:

- Music licensed for personal/web use (Epidemic Sound, Artlist, PremiumBeat…)
- Creative Commons tracks — check the licence allows your use, and credit as required
- A recording you or a friend made
- The built-in generative ambience (do nothing — it's already there)

## Keep it small

Guests will load this on mobile data. Aim for **under ~3 MB**: a 2–3 minute
loop at 96–128 kbps mono is plenty for background music. The file is
`preload="none"`, so it's only fetched if someone actually presses play — it
costs nothing to anyone who doesn't.
