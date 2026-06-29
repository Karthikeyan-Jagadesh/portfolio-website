import { useEffect, useState } from 'react'

const fallback = {
  publicRepos: 7,
  followers: 0,
  contributionsEstimate: 126,
}

export function useGitHubStats() {
  const [stats, setStats] = useState(() => {
    const cached = sessionStorage.getItem('aurumGithubStats')
    return cached ? JSON.parse(cached) : fallback
  })

  useEffect(() => {
    const cached = sessionStorage.getItem('aurumGithubStats')
    if (cached) return

    const controller = new AbortController()
    const username = import.meta.env.VITE_GITHUB_USERNAME || 'Karthikeyan-Jagadesh'

    async function load() {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`, { signal: controller.signal })
        if (!response.ok) throw new Error('GitHub unavailable')
        const user = await response.json()
        const next = {
          publicRepos: user.public_repos ?? fallback.publicRepos,
          followers: user.followers ?? fallback.followers,
          contributionsEstimate: Math.max(fallback.contributionsEstimate, (user.public_repos ?? 7) * 18),
        }
        sessionStorage.setItem('aurumGithubStats', JSON.stringify(next))
        setStats(next)
      } catch {
        sessionStorage.setItem('aurumGithubStats', JSON.stringify(fallback))
      }
    }

    load()
    return () => controller.abort()
  }, [])

  return stats
}
