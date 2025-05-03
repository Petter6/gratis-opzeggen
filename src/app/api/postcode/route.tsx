import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postcode = searchParams.get('postcode')
  const number = searchParams.get('number')

  if (!postcode || !number) {
    return NextResponse.json({ error: 'Postcode en huisnummer zijn vereist.' }, { status: 400 })
  }

  console.log('hallo')

  const token = process.env.POSTCODE_API_KEY

  const apiUrl = `https://json.api-postcode.nl/?postcode=${postcode}&number=${number}`

  console.log('Token used:', token)

  const res = await fetch(apiUrl, {
    headers: {
      token: token!,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Adres niet gevonden' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}