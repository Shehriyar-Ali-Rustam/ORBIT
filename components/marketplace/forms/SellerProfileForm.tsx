'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { sellerProfileSchema, type SellerProfileFormData } from '@/lib/validations/profile'
import { updateProfile } from '@/lib/marketplace/mutations'
import { uploadFile, generateFilePath } from '@/lib/supabase/storage'
import type { Profile } from '@/types/marketplace'
import { cn } from '@/lib/utils'

interface SellerProfileFormProps {
  profile: Profile
  onSaved?: (profile: Profile) => void
}

export function SellerProfileForm({ profile, onSaved }: SellerProfileFormProps) {
  const [saving, setSaving] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(profile.photo_url || '')
  const [skillInput, setSkillInput] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SellerProfileFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(sellerProfileSchema) as any,
    defaultValues: {
      tagline: profile.tagline || '',
      bio: profile.bio || '',
      skills: profile.skills || [],
      languages: profile.languages.length ? profile.languages : [{ language: '', level: 'conversational' }],
      hourly_rate: profile.hourly_rate,
      response_time: profile.response_time || '',
      country: profile.country || '',
      portfolio_urls: profile.portfolio_urls || [],
      github: profile.github || '',
      linkedin: profile.linkedin || '',
      fiverr: profile.fiverr || '',
    },
  })

  const skills = watch('skills')

  function addSkill() {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed) && skills.length < 15) {
      setValue('skills', [...skills, trimmed])
      setSkillInput('')
    }
  }

  function removeSkill(index: number) {
    setValue('skills', skills.filter((_, i) => i !== index))
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const path = generateFilePath(profile.id, file.name)
      const url = await uploadFile('profile-images', path, file)
      setPhotoUrl(url)
    } catch (err) {
      console.error('Photo upload failed:', err)
    }
  }

  async function onSubmit(data: SellerProfileFormData) {
    setSaving(true)
    try {
      const updated = await updateProfile(profile.id, {
        ...data,
        photo_url: photoUrl || null,
        github: data.github || null,
        linkedin: data.linkedin || null,
        fiverr: data.fiverr || null,
        hourly_rate: data.hourly_rate || null,
        response_time: data.response_time || null,
      })
      onSaved?.(updated)
    } catch (err) {
      console.error('Save failed:', err)
    }
    setSaving(false)
  }

  const inputClass = 'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Photo */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Profile Photo</label>
        <div className="flex items-center gap-4">
          {photoUrl ? (
            <img src={photoUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-dim text-lg font-bold text-orange">
              {profile.display_name.charAt(0)}
            </div>
          )}
          <label className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:border-orange hover:text-text-primary">
            Change Photo
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Tagline</label>
        <input {...register('tagline')} className={inputClass} placeholder="e.g. Full-Stack Developer specializing in AI" />
        {errors.tagline && <p className="mt-1 text-xs text-red-400">{errors.tagline.message}</p>}
      </div>

      {/* Bio */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Bio</label>
        <textarea {...register('bio')} rows={5} className={cn(inputClass, 'resize-none')} placeholder="Tell potential clients about yourself..." />
        {errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio.message}</p>}
      </div>

      {/* Skills */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Skills</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-orange-dim px-3 py-1 text-xs font-medium text-orange">
              {skill}
              <button type="button" onClick={() => removeSkill(i)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
            className={inputClass}
            placeholder="Type a skill and press Enter"
          />
          <Button type="button" variant="outline" size="sm" onClick={addSkill}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        {errors.skills && <p className="mt-1 text-xs text-red-400">{errors.skills.message}</p>}
      </div>

      {/* Country & Hourly Rate */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">Country</label>
          <input {...register('country')} className={inputClass} placeholder="e.g. United States" />
          {errors.country && <p className="mt-1 text-xs text-red-400">{errors.country.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">Hourly Rate ($)</label>
          <input {...register('hourly_rate')} type="number" className={inputClass} placeholder="e.g. 50" />
          {errors.hourly_rate && <p className="mt-1 text-xs text-red-400">{errors.hourly_rate.message}</p>}
        </div>
      </div>

      {/* Response Time */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Response Time</label>
        <select {...register('response_time')} className={inputClass}>
          <option value="">Select...</option>
          <option value="Within an hour">Within an hour</option>
          <option value="Within a few hours">Within a few hours</option>
          <option value="Within a day">Within a day</option>
        </select>
      </div>

      {/* Social Links */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">Social Links</label>
        <input {...register('github')} className={inputClass} placeholder="GitHub URL" />
        <input {...register('linkedin')} className={inputClass} placeholder="LinkedIn URL" />
        <input {...register('fiverr')} className={inputClass} placeholder="Fiverr URL" />
      </div>

      <Button type="submit" variant="primary" loading={saving} className="w-full sm:w-auto">
        Save Profile
      </Button>
    </form>
  )
}
