'use client'

import Header from "../../components/header/header";
import { Navigation } from "../../components/navigation/navigation";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) setError(error.message)

    setUser(data.user)

    const { error: dbError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user?.id,
          username: username,
          created_at: new Date(),
          favoritesIDs: [],
          myReviewsIDs: [],
        },
      ])

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    router.push('/user_profile')
    setLoading(false)
  }

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) setError(error.message)
    else {
      setUser(data.user)
      router.push('/user_profile')
    }
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
        <Header />
        <Navigation />
        <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
          <h1 className="text-6xl font-extrabold tracking-tight" style={{ marginBottom: 12}}>Login/Signup</h1>

          {!user ? (
              <>
              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
              />
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
              />

              <button className="button-login-signup" onClick={handleLogin} disabled={loading} style={{ marginBottom: 12 }}>
                  Log In
              </button>
              <input
                  type="username"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
              />
              <button className="button-login-signup" onClick={handleSignUp} disabled={loading}>
                  Sign Up
              </button>

              {error && <p style={{ color: 'red' }}>{error}</p>}
              </>
          ) : (
              <>
              <p>Logged in as: <strong>{user.email}</strong></p>
              </>
          )}
        </div>
    </main>
  )
}