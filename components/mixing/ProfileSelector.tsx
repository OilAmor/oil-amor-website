'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Plus, Trash2, Copy, Check, ChevronDown, Users } from 'lucide-react'
import { useHealthProfile } from '@/lib/context/health-profile-context'
import { cn } from '@/lib/utils'

export function ProfileSelector() {
  const {
    profiles,
    activeProfile,
    setActiveProfile,
    createProfile,
    deleteProfile,
    duplicateProfile,
  } = useHealthProfile()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      const newProfile = createProfile(newProfileName.trim())
      setActiveProfile(newProfile.id)
      setNewProfileName('')
      setIsCreating(false)
      setIsOpen(false)
    }
  }

  const handleDuplicate = (e: React.MouseEvent, profileId: string, name: string) => {
    e.stopPropagation()
    const duplicated = duplicateProfile(profileId, `${name} (Copy)`)
    setActiveProfile(duplicated.id)
    setIsOpen(false)
  }

  const handleDelete = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation()
    if (confirm('Delete this profile? This cannot be undone.')) {
      deleteProfile(profileId)
    }
  }

  return (
    <div className="relative">
      {/* Selected Profile Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4 rounded-xl border transition-all',
          isOpen 
            ? 'bg-[#c9a227]/10 border-[#c9a227]' 
            : 'bg-[#111] border-[#f5f3ef]/10 hover:border-[#c9a227]/30'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c9a227]/20 flex items-center justify-center">
            <User className="w-5 h-5 text-[#c9a227]" />
          </div>
          <div className="text-left">
            <p className="text-sm text-[#a69b8a]">Active Profile</p>
            <p className="text-lg font-medium text-[#f5f3ef]">
              {activeProfile?.name || 'Select Profile'}
            </p>
          </div>
        </div>
        <ChevronDown className={cn(
          'w-5 h-5 text-[#a69b8a] transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-[#f5f3ef]/10 rounded-xl overflow-hidden z-50"
          >
            {/* Profile List */}
            <div className="max-h-64 overflow-y-auto">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => {
                    setActiveProfile(profile.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-between p-3 cursor-pointer transition-colors',
                    activeProfile?.id === profile.id
                      ? 'bg-[#c9a227]/20'
                      : 'hover:bg-[#0a080c]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      activeProfile?.id === profile.id
                        ? 'bg-[#c9a227] text-[#0a080c]'
                        : 'bg-[#0a080c] text-[#a69b8a]'
                    )}>
                      {activeProfile?.id === profile.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        'font-medium',
                        activeProfile?.id === profile.id
                          ? 'text-[#c9a227]'
                          : 'text-[#f5f3ef]'
                      )}>
                        {profile.name}
                      </p>
                      <p className="text-xs text-[#a69b8a]">
                        {profile.data.conditions.length} conditions • 
                        {profile.data.age} years old
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDuplicate(e, profile.id, profile.name)}
                      className="p-2 text-[#a69b8a] hover:text-[#c9a227] transition-colors"
                      title="Duplicate profile"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {profiles.length > 1 && (
                      <button
                        onClick={(e) => handleDelete(e, profile.id)}
                        className="p-2 text-[#a69b8a] hover:text-red-400 transition-colors"
                        title="Delete profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Create New */}
            <div className="border-t border-[#f5f3ef]/10 p-3">
              {isCreating ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Profile name (e.g., 'Mom', 'My Child')"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0a080c] border border-[#f5f3ef]/10 text-[#f5f3ef] text-sm placeholder:text-[#a69b8a]/50"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateProfile()
                      if (e.key === 'Escape') {
                        setIsCreating(false)
                        setNewProfileName('')
                      }
                    }}
                  />
                  <button
                    onClick={handleCreateProfile}
                    disabled={!newProfileName.trim()}
                    className="px-3 py-2 rounded-lg bg-[#c9a227] text-[#0a080c] text-sm font-medium disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-[#0a080c] text-[#c9a227] hover:bg-[#c9a227]/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Create New Profile</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact version for header/navigation
export function ProfileSelectorCompact() {
  const { activeProfile, profiles, setActiveProfile } = useHealthProfile()
  const [isOpen, setIsOpen] = useState(false)

  if (profiles.length <= 1) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] text-sm hover:bg-[#c9a227]/20 transition-colors"
      >
        <Users className="w-4 h-4" />
        <span>{activeProfile?.name}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-[#f5f3ef]/10 rounded-xl overflow-hidden z-50"
          >
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => {
                  setActiveProfile(profile.id)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm transition-colors',
                  activeProfile?.id === profile.id
                    ? 'bg-[#c9a227]/20 text-[#c9a227]'
                    : 'text-[#f5f3ef] hover:bg-[#0a080c]'
                )}
              >
                {profile.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
