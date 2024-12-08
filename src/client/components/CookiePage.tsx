import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { AppContainer } from './AppContainer';

type Result = 'success' | 'invalid_code' | 'invalid_cookie' | 'unknown' | null

export const CookiePage = () => {
  const search = useSearch();
  const [params, setParams] = useState<URLSearchParams | null>(null)
  const [cookie, setCookie] = useState('')
  const [result, setResult] = useState<Result>(null)

  useEffect(() => {
    setParams(new URLSearchParams(search))
  }, [search])

  const onCookieChange = (e: ChangeEvent<HTMLInputElement>) => setCookie(e.currentTarget.value)

  const onSubmit = (e: FormEvent) => e.preventDefault()

  const onClick = async () => {
    const result = await fetch('/set_cookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: params?.get('code'),
        cookie,
      }),
    })
    if (!result.ok) return setResult('unknown')
    try {
      const data = await result.json()
      if (data.success) {
        return setResult('success')
      } else if (['invalid_code', 'invalid_cookie'].includes(data.error)) {
        return setResult(data.error)
      } else {
        return setResult('unknown')
      }
    } catch {
      return setResult('unknown')
    }
  }

  return (
    <AppContainer showSearch={false} displayAnnouncements={false}>
      <div className='cookie'>
        {result == 'success' && <h2>Success</h2>}
        {result == 'invalid_code' && <h2>Code is invalid</h2>}
        {result == 'invalid_cookie' && <h2>Cookie is invalid</h2>}
        {result == 'unknown' && <h2>Unknown error</h2>}

        <form action='/set_cookie' onSubmit={onSubmit}>
          <label htmlFor='cookie'>Cookie:</label><br />
          <input type='text' name='cookie' id='cookie' value={cookie} onChange={onCookieChange} />
          <br />
          <input type='submit' value='Submit' onClick={onClick} />
        </form>
        <div className='instructions'>
          <p><img src='/assets/images/mpc-cookie-manual.png' /></p>
          <h3>To get the cookie:</h3>
          <ol>
            <li>Log into the Arkham Horror Homebrew MPC account.</li>
            <li>Go to your <a href='https://www.makeplayingcards.com/design/dn_temporary_designes.aspx'>Saved Projects</a> page.</li>
            <li>Open developer tools in your browser and go to the <strong>Application</strong> tab.</li>
            <li>In the left panel, expand <strong>Cookies</strong> and click &ldquo;https://www/makeplayingcards.com&rdquo;</li>
            <li>Search for <code>__p</code> and click on <code>__pcunck</code>.</li>
            <li>Copy the <strong>Cookie Value</strong> displayed at the bottom of the dev tools tab.</li>
            <li>Paste the cookie into the input above and submit.</li>
            <li>Thank you for fighting the good fight to keep homebrew printing available!</li>
          </ol>
          <p className='note'>If you work at MPC please note that we are not violating anyone&rsquo;s copyright and not doing anything malicious. We only want to make it easier for people to use your service to print cards without the person who uploads the cards selling them at a profit, which violates the fair use of IP. This is a win-win!</p>
        </div>
      </div>
    </AppContainer >
  )
}
