const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO = process.env.GITHUB_REPO || 'LedjetL/kudo-rental'
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'
const FILE_PATH = 'public/availability.json'

export default async function handler(req: any, res: any) {
  try {
    const getRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (!getRes.ok) {
      return res.status(200).json({})
    }

    const fileData = await getRes.json()
    const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'))

    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json(content)
  } catch {
    return res.status(200).json({})
  }
}
