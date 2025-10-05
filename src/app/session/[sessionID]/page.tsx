'use client'

import { useState, useEffect, use } from 'react'
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout'
import { apiClient } from '@/lib/api'

interface slugProp {
  sessionID: string
}

export default function Session({ params }: { params: Promise<{ sessionID: string }> }) {

  const { sessionID } = use(params);;

  const [sessionData, setSessionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        const resp = await apiClient.getSessionData(sessionID)
        if(resp.error){
          console.log("Error fetching session data")
          throw resp.error;
        }
        setIsLoading(false);
        setSessionData(resp.data.session);
      } catch (error) {
        console.log("Error fetching session data")
      }
    }

    fetchSessionData();

  }, [sessionID])
  
  const handleDisconnect = () => {
    setSessionData(null)
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!sessionData) {
    return (
      <AuthenticatedLayout>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-gray-600">Session not found</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  // Calculate metrics from session data
  const duration = sessionData.duration ? Math.round(sessionData.duration / 60) : 0
  const moodScore = sessionData.mood_score ? Math.round(sessionData.mood_score * 10) : 0
  const engagement_score = sessionData.engagement_score ? Math.round(sessionData.engagement_score * 10) : 0
  const wordCount = sessionData.word_count || 0

  return (
    <AuthenticatedLayout>
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {sessionData.title || 'Session Details'}
          </h1>
          <p className="text-gray-600">
            {new Date(sessionData.started_at).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Duration Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{duration}</div>
                <div className="text-sm text-gray-500">minutes</div>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mood Score Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{moodScore}%</div>
                <div className="text-sm text-gray-500">mood score</div>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Topics Count Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{engagement_score}%</div>
                <div className="text-sm text-gray-500">engagement score</div>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Word Count Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{wordCount}</div>
                <div className="text-sm text-gray-500">words spoken</div>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Session Summary */}
          {sessionData.summary && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Summary</h3>
              <p className="text-gray-700 leading-relaxed">{sessionData.summary}</p>
            </div>
          )}

          {/* Key Topics */}
          {sessionData.key_topics && sessionData.key_topics.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Topics Discussed</h3>
              <div className="flex flex-wrap gap-2">
                {sessionData.key_topics.map((topic: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Primary Emotions */}
          {sessionData.primary_emotions && sessionData.primary_emotions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Emotions</h3>
              <div className="flex flex-wrap gap-2">
                {sessionData.primary_emotions.map((emotion: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Breakthrough Moments */}
          {sessionData.breakthrough_moments && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
              <p className="text-gray-700 leading-relaxed">{sessionData.breakthrough_moments}</p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}