"use client"

interface WebsBrowserProps {
  url: string
}

export const WebsBrowser = ({
  url
}: WebsBrowserProps) => {
  return (
    <div>
      <h1>
        Embed External Site
      </h1>
      <iframe
        src="https://scholar.google.com/" // 将 example.com 替换为你想嵌入的网站，注意网站必须允许iframe嵌入
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title="External Site"
        allowFullScreen
      >

      </iframe>
    </div>
  )
}