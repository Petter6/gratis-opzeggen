'use client'

import { AlignJustify } from 'lucide-react'
import { useState, useEffect } from 'react'


export default function RegistrationForm() {
  const [aanhef, setAanhef] = useState('')
  const [geboortedatum, setGeboortedatum] = useState('')
  const [voorletters, setVoorletters] = useState('')
  const [voornaam, setVoornaam] = useState('')
  const [tussenvoegsel, setTussenvoegsel] = useState('')
  const [achternaam, setAchternaam] = useState('')

  const [postcode, setPostcode] = useState('')
  const [huisnummer, setHuisnummer] = useState('')
  const [toevoeging, setToevoeging] = useState('')
  const [straatnaam, setStraatnaam] = useState('')
  const [woonplaats, setWoonplaats] = useState('')
  const [email, setemail] = useState('')
  const [land, setLand] = useState('Nederland')

  const [lotnummers, setLotnummers] = useState([''])

  const fetchAddress = async () => {
    try {
      const toevoegingParam = toevoeging ? `-${toevoeging}` : ''

      
      const res = await fetch(`/api/postcode?postcode=${postcode}&number=${huisnummer}`)
        const data = await res.json()
        setStraatnaam(data.street)
        setWoonplaats(data.city)

    } catch (err) {
      setStraatnaam('')
      setWoonplaats('')
    }
  }

  useEffect(() => {
    if (postcode && huisnummer) {
      const timeout = setTimeout(fetchAddress, 1000)
      return () => clearTimeout(timeout)
    }
  }, [postcode, huisnummer, toevoeging])

  

  const handleLotnummerChange = (value: string, index: number) => {
    const updated = [...lotnummers]
    updated[index] = value
    setLotnummers(updated)
  }

  const addLotnummer = () => setLotnummers([...lotnummers, ''])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const verplichtIngevuld =
      aanhef &&
      geboortedatum &&
      voorletters &&
      voornaam &&
      achternaam &&
      postcode &&
      huisnummer &&
      email &&
      lotnummers.some(nr => nr.trim() !== '');
  
    if (!verplichtIngevuld) {
      alert('Vul alle verplichte velden in voordat je het formulier verstuurt.');
      return;
    }
  
    const data = {
      aanhef,
      geboortedatum,
      voorletters,
      voornaam,
      tussenvoegsel,
      achternaam,
      postcode,
      huisnummer,
      toevoeging,
      straatnaam,
      woonplaats,
      land,
      email,
      lotnummers,
    };
  
    console.log("✅ Formuliergegevens:", data);
  
    await fetch('/api/start-browser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
  

  return (
    <form onSubmit={handleSubmit} style={formContainer} lang="nl">
      {/* Aanhef */}
      <div style={formGroup}>
        <label style={label}>Aanhef *</label>
        <select value={aanhef} onChange={e => setAanhef(e.target.value)} style={input}>
          <option value="">Maak een keuze...</option>
          <option value="Dhr">Dhr</option>
          <option value="Mevr">Mevr</option>
        </select>
      </div>

      {/* Geboortedatum */}
      <div style={formGroup}>
        <label style={label}>Geboortedatum *</label>
        <input type="date" value={geboortedatum} onChange={e => setGeboortedatum(e.target.value)} style={input} />
      </div>

      {/* Naamvelden */}
      <div style={row}>
        <div style={half}>
          <label style={label}>Voorletters *</label>
          <input value={voorletters} onChange={e => setVoorletters(e.target.value)} style={input} />
        </div>
        <div style={half}>
          <label style={label}>Voornaam *</label>
          <input value={voornaam} onChange={e => setVoornaam(e.target.value)} style={input} />
        </div>
      </div>

      <div style={row}>
        <div style={half}>
          <label style={label}>Tussenvoegsel</label>
          <input value={tussenvoegsel} onChange={e => setTussenvoegsel(e.target.value)} style={input} />
        </div>
        <div style={half}>
          <label style={label}>Achternaam *</label>
          <input value={achternaam} onChange={e => setAchternaam(e.target.value)} style={input} />
        </div>
      </div>

      {/* Adresvelden */}
      <div style={row}>
        <div style={third}>
          <label style={label}>Postcode *</label>
          <input value={postcode} onChange={e => setPostcode(e.target.value)} style={input} />
        </div>
        <div style={third}>
          <label style={label}>Huisnummer *</label>
          <input value={huisnummer} onChange={e => setHuisnummer(e.target.value)} style={input} />
        </div>
        <div style={third}>
          <label style={label}>Toevoeging</label>
          <input value={toevoeging} onChange={e => setToevoeging(e.target.value)} style={input} />
        </div>
      </div>

      <div style={row}>
        <div style={half}>
            <label style={label}>Straatnaam</label>
            <input value={straatnaam} readOnly style={readonlyInput} />
        </div>
        <div style={half}>
            <label style={label}>Woonplaats</label>
            <input value={woonplaats} readOnly style={readonlyInput} />
        </div>
      </div>
      <div style={formGroup}>
        <label style={label}>Land</label>
        <input value={land} onChange={e => setLand(e.target.value)} style={input} />
      </div>
      <div style={formGroup}>
        <label style={label}>E-mailadres *</label>
        <input value={email} onChange={e => setemail(e.target.value)} style={input} />
      </div>

      {/* Lotnummers */}
      <div style={formGroup}>
        <label style={label}>Lotnummer *</label>
        {lotnummers.map((lot, idx) => (
          <input
            key={idx}
            value={lot}
            onChange={e => handleLotnummerChange(e.target.value, idx)}
            placeholder={`Lotnummer ${idx + 1}`}
            style={{ ...input, marginBottom: '0.5rem' }}
          />
        ))}
        <button type="button" onClick={addLotnummer} style={linkButton}>
          + voeg nog een lotnummer toe
        </button>
        <button type="submit" style={submitButton}>
  Verzend
</button>
      </div>
    </form>
  )
}

const formContainer = {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#fff',
    fontFamily: 'sans-serif',
  } as const
  
  const formGroup = {
    marginBottom: '1.25rem',
  } as const
  
  const input = {
    width: '100%',
    padding: '0.65rem 0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff', // standaard wit
  } as const
  
  const readonlyInput = {
    ...input,
    backgroundColor: '#f5f5f5', // lichtgrijs, zoals in screenshot
    color: '#333',
    cursor: 'not-allowed',
  }
  
  const label = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
  } as const
  
  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    gap: '1rem',
  } as const
  
  const half = {
    width: "46%",
  }
  
  const third = {
    width: "29%",
  }
  
  const linkButton = {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    cursor: 'pointer',
    fontSize: '1rem',
    textDecoration: 'underline',
  } as const
  
  const submitButton = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
  } as const