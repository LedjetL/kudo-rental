const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO || 'LedjetL/kudo-rental'
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kudo-admin'
const FILE_PATH = 'public/availability.json'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { availability, password } = req.body

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN not set in environment variables' })
  }

  try {
    // Get current file to retrieve its SHA (required for updates)
    const getRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    let sha: string | undefined
    if (getRes.ok) {
      const fileData = await getRes.json()
      sha = fileData.sha
    }

    // Encode new content as base64
    const newContent = JSON.stringify(availability, null, 2)
    const encoded = Buffer.from(newContent).toString('base64')

    // Commit the updated file
    const updateRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update car availability`,
          content: encoded,
          branch: GITHUB_BRANCH,
          ...(sha ? { sha } : {}),
        }),
      }
    )

    if (!updateRes.ok) {
      const err = await updateRes.json()
      return res.status(500).json({ error: 'GitHub API error', details: err.message })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
