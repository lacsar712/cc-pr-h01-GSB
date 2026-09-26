import { useEffect, useState } from 'react'

export default function App() {
  const [username, setUsername] = useState('printer')
  const [password, setPassword] = useState('print123456')
  const [token, setToken] = useState(localStorage.getItem('print_token') || '')
  const [role, setRole] = useState(localStorage.getItem('print_role') || '')
  const [rows, setRows] = useState([])
  const [detail, setDetail] = useState(null)
  const [detailError, setDetailError] = useState('')
  const [sheet, setSheet] = useState('插页-02')
  const [cyan, setCyan] = useState('0.08')
  const [magenta, setMagenta] = useState('0.02')
  const [error, setError] = useState('')

  async function api(path, options = {}) {
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.detail || '请求失败')
    return data
  }

  async function load() {
    const data = await api('/api/jobs')
    setRows([...(data || [])].reverse())
  }

  useEffect(() => {
    if (!token) return
    load()
    const timer = setInterval(load, 1000)
    return () => clearInterval(timer)
  }, [token])

  async function enter() {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    localStorage.setItem('print_token', data.access_token)
    localStorage.setItem('print_role', data.role)
    setToken(data.access_token)
    setRole(data.role)
  }

  async function send() {
    setError('')
    try {
      await api('/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          sheet,
          cyan_mm: Number(cyan),
          magenta_mm: Number(magenta),
        }),
      })
    } catch (err) {
      setError(err.message)
    }
  }

  async function openDetail(id) {
    setDetailError('')
    try {
      setDetail(await api(`/api/jobs/${id}`))
    } catch (err) {
      setDetailError(err.message)
    }
  }

  function leave() {
    localStorage.clear()
    setToken('')
    setRole('')
  }

  function verdictStyle(verdict) {
    if (verdict === '套准') return { color: '#15803d' }
    if (verdict === '套不准') return { color: '#b91c1c' }
    return { color: '#6b7280' }
  }

  if (!token) {
    return (
      <main>
        <h1>印刷套准复核台</h1>
        <p>提交后接口只入队。另一进程领走偏差并写结论，页面轮询到结论出现。</p>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={enter}>登录</button>
        <p>printer / print123456 可送复核；checker / check123456 只看</p>
      </main>
    )
  }

  return (
    <main>
      <h1>印刷套准复核台</h1>
      <button onClick={leave}>退出</button>
      {role === 'writer' && (
        <p>
          <input value={sheet} onChange={(e) => setSheet(e.target.value)} />
          <input value={cyan} onChange={(e) => setCyan(e.target.value)} />
          <input value={magenta} onChange={(e) => setMagenta(e.target.value)} />
          <button onClick={send}>送复核</button>
        </p>
      )}
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr><th>印张</th><th>青</th><th>品</th><th>状态</th><th>结论</th><th>详情</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.sheet}</td>
              <td>{row.cyan_mm}</td>
              <td>{row.magenta_mm}</td>
              <td>{row.status}</td>
              <td style={verdictStyle(row.verdict)}>{row.verdict || '等待'}</td>
              <td><button onClick={() => openDetail(row.id)}>查看理由</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {detail && (
        <section>
          <h2>详情：{detail.sheet}</h2>
          <p>青偏差 {detail.cyan_mm} mm，品偏差 {detail.magenta_mm} mm</p>
          <p style={verdictStyle(detail.verdict)}>结论：{detail.verdict || '等待'}</p>
          <p>理由：{detail.reason || '等待判定'}</p>
          <button onClick={() => setDetail(null)}>关闭</button>
        </section>
      )}
      {detailError && <p>{detailError}</p>}
    </main>
  )
}
