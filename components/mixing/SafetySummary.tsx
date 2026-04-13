'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Shield, 
  X,
  ChevronDown,
  ChevronUp,
  Heart,
  Pill,
  Baby,
  Wind,
  Sun,
  Beaker,
  User,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  SafetyValidationResult, 
  SafetyWarning, 
  ExperienceLevel,
  RiskLevel 
} from '@/lib/safety/comprehensive-safety-v2'

interface SafetySummaryProps {
  validation: SafetyValidationResult | null
  onAcknowledge?: (warningIds: string[]) => void
  className?: string
  compact?: boolean
}

const riskLevelConfig: Record<RiskLevel, { 
  icon: React.ReactNode
  color: string 
  bgColor: string
  borderColor: string
  label: string
}> = {
  info: {
    icon: <Info className="w-4 h-4" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    label: 'Info'
  },
  low: {
    icon: <Info className="w-4 h-4" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    label: 'Note'
  },
  moderate: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    label: 'Caution'
  },
  high: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    label: 'Warning'
  },
  critical: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    label: 'Critical'
  }
}

const categoryIcons: Record<string, React.ReactNode> = {
  medication: <Pill className="w-4 h-4" />,
  condition: <Heart className="w-4 h-4" />,
  age: <Baby className="w-4 h-4" />,
  pregnancy: <Heart className="w-4 h-4" />,
  lactation: <Baby className="w-4 h-4" />,
  dosage: <Beaker className="w-4 h-4" />,
  route: <Wind className="w-4 h-4" />,
  toxicity: <AlertTriangle className="w-4 h-4" />,
  allergy: <X className="w-4 h-4" />,
}

// Get message based on experience level
function getWarningMessage(warning: SafetyWarning, experience: ExperienceLevel): string {
  switch (experience) {
    case 'professional':
      return warning.messageProfessional || warning.messageAdvanced || warning.message
    case 'advanced':
      return warning.messageAdvanced || warning.messageIntermediate || warning.message
    case 'intermediate':
      return warning.messageIntermediate || warning.message
    case 'beginner':
    default:
      return warning.message
  }
}

// Warning Item Component
function WarningCard({ 
  warning, 
  experience, 
  isAcknowledged, 
  onAcknowledge,
  showAcknowledge 
}: { 
  warning: SafetyWarning
  experience: ExperienceLevel
  isAcknowledged: boolean
  onAcknowledge: () => void
  showAcknowledge: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = riskLevelConfig[warning.riskLevel]
  const message = getWarningMessage(warning, experience)
  
  const showDetailed = experience === 'beginner' || experience === 'intermediate' || isExpanded

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border overflow-hidden transition-all',
        config.borderColor,
        isAcknowledged ? 'bg-[#0a080c]/50' : config.bgColor
      )}
    >
      {/* Header */}
      <div 
        className={cn(
          'p-4 flex items-start gap-3 cursor-pointer',
          warning.detailedExplanation && 'hover:bg-[#f5f3ef]/5'
        )}
        onClick={() => warning.detailedExplanation && setIsExpanded(!isExpanded)}
      >
        <div className={cn('mt-0.5', config.color)}>
          {categoryIcons[warning.category] || config.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-xs font-medium uppercase tracking-wider', config.color)}>
              {config.label}
            </span>
            {warning.routeSpecific && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f5f3ef]/10 text-[#a69b8a]">
                {warning.routeSpecific.join(', ')}
              </span>
            )}
          </div>
          
          <h4 className="text-sm font-medium text-[#f5f3ef] mt-1">{warning.title}</h4>
          <p className={cn(
            'text-sm mt-1',
            isAcknowledged ? 'text-[#a69b8a]/60' : 'text-[#a69b8a]'
          )}>
            {message}
          </p>
          
          {/* Alternatives */}
          {warning.alternatives && warning.alternatives.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-[#c9a227]">Alternatives:</span>
              {warning.alternatives.map((alt) => (
                <span 
                  key={alt} 
                  className="text-xs px-2 py-0.5 rounded-full bg-[#c9a227]/10 text-[#c9a227]"
                >
                  {alt}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {warning.detailedExplanation && (
          <button className="text-[#a69b8a] hover:text-[#f5f3ef] transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && warning.detailedExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[#f5f3ef]/10"
          >
            <div className="p-4 pt-3">
              <p className="text-sm text-[#a69b8a] leading-relaxed">
                {warning.detailedExplanation}
              </p>
              
              {warning.recommendation && (
                <div className="mt-3 p-3 rounded-lg bg-[#c9a227]/10 border border-[#c9a227]/20">
                  <p className="text-sm text-[#c9a227]">
                    <span className="font-medium">Recommendation:</span> {warning.recommendation}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Acknowledgment Checkbox */}
      {showAcknowledge && warning.requiresAcknowledgment && (
        <div className="px-4 pb-4">
          <label className={cn(
            'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
            isAcknowledged 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-[#0a080c] border-[#f5f3ef]/10 hover:border-[#f5f3ef]/30'
          )}>
            <input
              type="checkbox"
              checked={isAcknowledged}
              onChange={onAcknowledge}
              className="mt-0.5 w-4 h-4 rounded bg-[#111] border-[#f5f3ef]/30 text-[#c9a227]"
            />
            <span className={cn(
              'text-sm',
              isAcknowledged ? 'text-green-400' : 'text-[#a69b8a]'
            )}>
              {warning.acknowledgmentText || 'I understand and accept this risk'}
            </span>
          </label>
        </div>
      )}
    </motion.div>
  )
}

// Compact Warning Item
function CompactWarningItem({ warning, experience }: { warning: SafetyWarning; experience: ExperienceLevel }) {
  const config = riskLevelConfig[warning.riskLevel]
  const message = getWarningMessage(warning, experience)
  
  return (
    <div className={cn(
      'flex items-start gap-2 p-2 rounded-lg',
      config.bgColor
    )}>
      <div className={cn('mt-0.5', config.color)}>
        {categoryIcons[warning.category] || config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs font-medium', config.color)}>{warning.title}</p>
        <p className="text-xs text-[#a69b8a] truncate">{message}</p>
      </div>
    </div>
  )
}

// Safety Score Ring
function SafetyScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference - (score / 100) * circumference
  
  let color = '#ef4444' // red
  if (score >= 90) color = '#22c55e' // green
  else if (score >= 70) color = '#eab308' // yellow
  else if (score >= 50) color = '#f97316' // orange
  
  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 -rotate-90">
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-[#f5f3ef]/10"
        />
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium text-[#f5f3ef]">{score}</span>
      </div>
    </div>
  )
}

export function SafetySummary({ 
  validation, 
  onAcknowledge, 
  className,
  compact = false
}: SafetySummaryProps) {
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState<Set<string>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['critical']))
  
  if (!validation) {
    return (
      <div className={cn('p-6 rounded-2xl bg-[#0a080c] border border-[#f5f3ef]/10', className)}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#f5f3ef]/5 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#a69b8a]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#f5f3ef]">Safety Check</h3>
            <p className="text-sm text-[#a69b8a]">Add oils to see safety analysis</p>
          </div>
        </div>
      </div>
    )
  }
  
  const { 
    warnings, 
    criticalWarnings, 
    requiresAcknowledgment,
    experienceLevel,
    safetyScore 
  } = validation
  
  // Group warnings by risk level
  const critical = warnings.filter(w => w.riskLevel === 'critical')
  const high = warnings.filter(w => w.riskLevel === 'high')
  const moderate = warnings.filter(w => w.riskLevel === 'moderate')
  const low = warnings.filter(w => w.riskLevel === 'low' || w.riskLevel === 'info')
  
  const hasCritical = critical.length > 0
  const hasHigh = high.length > 0
  const hasModerate = moderate.length > 0
  const hasLow = low.length > 0
  const hasAnyWarnings = warnings.length > 0
  
  const allCriticalAcknowledged = critical.every(w => 
    !w.requiresAcknowledgment || acknowledgedWarnings.has(w.id)
  )
  
  const canProceedWithAcknowledgment = !requiresAcknowledgment || allCriticalAcknowledged
  
  const handleAcknowledge = (warningId: string) => {
    const newAcknowledged = new Set(acknowledgedWarnings)
    if (newAcknowledged.has(warningId)) {
      newAcknowledged.delete(warningId)
    } else {
      newAcknowledged.add(warningId)
    }
    setAcknowledgedWarnings(newAcknowledged)
    onAcknowledge?.(Array.from(newAcknowledged))
  }
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }
  
  // Compact mode
  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Status Header */}
        <div className={cn(
          'p-3 rounded-xl border flex items-center gap-3',
          hasCritical 
            ? 'bg-red-500/10 border-red-500/30' 
            : hasHigh
              ? 'bg-orange-500/10 border-orange-500/30'
              : hasAnyWarnings
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-green-500/10 border-green-500/30'
        )}>
          <SafetyScoreRing score={safetyScore} />
          <div className="flex-1">
            <p className={cn(
              'text-sm font-medium',
              hasCritical ? 'text-red-400' : hasHigh ? 'text-orange-400' : hasAnyWarnings ? 'text-yellow-400' : 'text-green-400'
            )}>
              {hasCritical ? 'Critical Risks' : hasHigh ? 'High Risks' : hasAnyWarnings ? 'Review Warnings' : 'All Clear'}
            </p>
            <p className="text-xs text-[#a69b8a]">
              {warnings.length} warning{warnings.length !== 1 && 's'} • {experienceLevel} view
            </p>
          </div>
        </div>
        
        {/* Compact Warning List */}
        {hasAnyWarnings && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {critical.slice(0, 2).map(warning => (
              <CompactWarningItem key={warning.id} warning={warning} experience={experienceLevel} />
            ))}
            {high.slice(0, 2).map(warning => (
              <CompactWarningItem key={warning.id} warning={warning} experience={experienceLevel} />
            ))}
            {warnings.length > 4 && (
              <p className="text-xs text-center text-[#a69b8a] py-1">
                +{warnings.length - 4} more warnings
              </p>
            )}
          </div>
        )}
        
        {/* Acknowledgment Status */}
        {requiresAcknowledgment && (
          <div className={cn(
            'p-2 rounded-lg text-center text-xs',
            canProceedWithAcknowledgment 
              ? 'bg-green-500/10 text-green-400' 
              : 'bg-red-500/10 text-red-400'
          )}>
            {canProceedWithAcknowledgment 
              ? '✓ All critical risks acknowledged' 
              : `⚠ ${critical.filter(w => w.requiresAcknowledgment && !acknowledgedWarnings.has(w.id)).length} acknowledgment${critical.filter(w => w.requiresAcknowledgment && !acknowledgedWarnings.has(w.id)).length !== 1 ? 's' : ''} required`}
          </div>
        )}
      </div>
    )
  }
  
  // Full mode
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            hasCritical ? 'bg-red-500/20' : hasHigh ? 'bg-orange-500/20' : hasAnyWarnings ? 'bg-yellow-500/20' : 'bg-green-500/20'
          )}>
            {hasCritical ? (
              <AlertTriangle className="w-6 h-6 text-red-400" />
            ) : hasHigh ? (
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            ) : hasAnyWarnings ? (
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#f5f3ef]">Safety Analysis</h3>
            <p className="text-sm text-[#a69b8a]">
              {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} view • {warnings.length} warning{warnings.length !== 1 && 's'}
            </p>
          </div>
        </div>
        
        <SafetyScoreRing score={safetyScore} />
      </div>
      
      {/* Status Banner */}
      <div className={cn(
        'p-4 rounded-xl border flex items-start gap-3',
        hasCritical 
          ? 'bg-red-500/10 border-red-500/30' 
          : hasHigh
            ? 'bg-orange-500/10 border-orange-500/30'
            : hasAnyWarnings
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-green-500/10 border-green-500/30'
      )}>
        {hasCritical ? (
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
        ) : hasHigh ? (
          <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
        ) : hasAnyWarnings ? (
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
        )}
        <div>
          <p className={cn(
            'font-medium',
            hasCritical ? 'text-red-400' : hasHigh ? 'text-orange-400' : hasAnyWarnings ? 'text-yellow-400' : 'text-green-400'
          )}>
            {hasCritical 
              ? 'Critical Safety Issues' 
              : hasHigh 
                ? 'High Risk Warnings' 
                : hasAnyWarnings 
                  ? 'Review Warnings Before Use' 
                  : 'Safe for Your Profile'}
          </p>
          <p className="text-sm text-[#a69b8a] mt-1">
            {hasCritical 
              ? 'These combinations require your attention and acknowledgment.' 
              : hasAnyWarnings 
                ? 'Please review the warnings below before using this blend.' 
                : 'This blend appears safe based on your health profile.'}
          </p>
        </div>
      </div>
      
      {/* Critical Warnings Section */}
      {hasCritical && (
        <div className="space-y-3">
          <button 
            onClick={() => toggleSection('critical')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical ({critical.length})
            </h4>
            {expandedSections.has('critical') ? <ChevronUp className="w-4 h-4 text-[#a69b8a]" /> : <ChevronDown className="w-4 h-4 text-[#a69b8a]" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.has('critical') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3"
              >
                {critical.map(warning => (
                  <WarningCard
                    key={warning.id}
                    warning={warning}
                    experience={experienceLevel}
                    isAcknowledged={acknowledgedWarnings.has(warning.id)}
                    onAcknowledge={() => handleAcknowledge(warning.id)}
                    showAcknowledge={true}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* High Warnings Section */}
      {hasHigh && (
        <div className="space-y-3">
          <button 
            onClick={() => toggleSection('high')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-orange-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              High Risk ({high.length})
            </h4>
            {expandedSections.has('high') ? <ChevronUp className="w-4 h-4 text-[#a69b8a]" /> : <ChevronDown className="w-4 h-4 text-[#a69b8a]" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.has('high') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3"
              >
                {high.map(warning => (
                  <WarningCard
                    key={warning.id}
                    warning={warning}
                    experience={experienceLevel}
                    isAcknowledged={acknowledgedWarnings.has(warning.id)}
                    onAcknowledge={() => handleAcknowledge(warning.id)}
                    showAcknowledge={false}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Moderate Warnings Section */}
      {hasModerate && (
        <div className="space-y-3">
          <button 
            onClick={() => toggleSection('moderate')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-yellow-400 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Cautions ({moderate.length})
            </h4>
            {expandedSections.has('moderate') ? <ChevronUp className="w-4 h-4 text-[#a69b8a]" /> : <ChevronDown className="w-4 h-4 text-[#a69b8a]" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.has('moderate') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2"
              >
                {moderate.map(warning => (
                  <WarningCard
                    key={warning.id}
                    warning={warning}
                    experience={experienceLevel}
                    isAcknowledged={acknowledgedWarnings.has(warning.id)}
                    onAcknowledge={() => handleAcknowledge(warning.id)}
                    showAcknowledge={false}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Low/Info Warnings Section */}
      {hasLow && (
        <div className="space-y-3">
          <button 
            onClick={() => toggleSection('low')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-[#a69b8a] flex items-center gap-2">
              <Info className="w-4 h-4" />
              Information ({low.length})
            </h4>
            {expandedSections.has('low') ? <ChevronUp className="w-4 h-4 text-[#a69b8a]" /> : <ChevronDown className="w-4 h-4 text-[#a69b8a]" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.has('low') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2"
              >
                {low.map(warning => (
                  <WarningCard
                    key={warning.id}
                    warning={warning}
                    experience={experienceLevel}
                    isAcknowledged={acknowledgedWarnings.has(warning.id)}
                    onAcknowledge={() => handleAcknowledge(warning.id)}
                    showAcknowledge={false}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Acknowledgment Summary */}
      {requiresAcknowledgment && (
        <div className={cn(
          'p-4 rounded-xl border flex items-center gap-3',
          canProceedWithAcknowledgment 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        )}>
          {canProceedWithAcknowledgment ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          )}
          <div className="flex-1">
            <p className={cn(
              'text-sm font-medium',
              canProceedWithAcknowledgment ? 'text-green-400' : 'text-red-400'
            )}>
              {canProceedWithAcknowledgment 
                ? 'All Required Acknowledgments Complete' 
                : 'Acknowledgment Required'}
            </p>
            <p className="text-xs text-[#a69b8a]">
              {canProceedWithAcknowledgment 
                ? 'You can proceed with confidence.' 
                : 'Please acknowledge all critical warnings to proceed.'}
            </p>
          </div>
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="p-3 rounded-lg bg-[#0a080c] border border-[#f5f3ef]/5">
        <p className="text-[10px] text-[#a69b8a]/60 leading-relaxed">
          <strong className="text-[#a69b8a]">Disclaimer:</strong> This safety analysis is for educational purposes only. 
          Always consult a qualified healthcare provider or certified aromatherapist before using essential oils, 
          especially if you have medical conditions, are pregnant, or take medications.
        </p>
      </div>
    </div>
  )
}

export default SafetySummary
