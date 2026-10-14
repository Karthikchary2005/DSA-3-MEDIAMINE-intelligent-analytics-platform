import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Video,
  FileText,
  FileCode,
  GraduationCap,
  Newspaper,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { getStoredMedia, saveStoredMedia } from '../services/storageService.js';

export default function AddMedia() {
  const navigate = useNavigate();

  const [type, setType] = useState('article');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('Generative AI');
  const [author, setAuthor] = useState('MediaMine Editorial');
  const [source, setSource] = useState('MediaMine Intelligence');
  const [tagsInput, setTagsInput] = useState('generative ai, deep learning, artificial intelligence');
  const [content, setContent] = useState('');
  const [transcript, setTranscript] = useState('');
  const [duration, setDuration] = useState('18:45');
  const [abstract, setAbstract] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [syllabusInput, setSyllabusInput] = useState('Module 1: Foundations\nModule 2: Core Architectures\nModule 3: Production Deployment');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Title is mandatory.');
      return;
    }

    if (!content.trim() && !transcript.trim() && !description.trim()) {
      setError('Please provide content body or transcript text.');
      return;
    }

    setIsSubmitting(true);

    const tags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    const syllabus = syllabusInput.split('\n').map(s => s.trim()).filter(Boolean);

    const newRecord = {
      id: `med-${type.substring(0, 3)}-${Date.now()}`,
      type,
      title: title.trim(),
      description: description.trim(),
      topic: topic.trim(),
      author: author.trim(),
      source: source.trim(),
      publishedAt: new Date().toISOString().split('T')[0],
      tags,
      content: content.trim(),
      transcript: transcript.trim(),
      captions: transcript.trim() ? [
        { start: '00:00', end: '05:00', text: transcript.substring(0, 150) + '...' }
      ] : [],
      duration: type === 'video' ? duration : null,
      difficulty: type === 'course' ? difficulty : null,
      syllabus: type === 'course' ? syllabus : null,
      abstract: type === 'research' ? abstract.trim() : null,
      thumbnail: type === 'video' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' : ''
    };

    const currentMedia = getStoredMedia();
    const updated = [newRecord, ...currentMedia];
    saveStoredMedia(updated);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess('Record successfully published and indexed! Available in global search immediately.');
      setTimeout(() => {
        navigate(`/media/${newRecord.id}`);
      }, 1200);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-950/40 pb-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and return</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FilePlus className="w-7 h-7 text-emerald-400" />
            <span>Publish New Media Document</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author and publish new content. All algorithms and search indices will immediately synchronize.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Publishing Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-panel space-y-6 text-xs">
        {/* Content Type Selector */}
        <div>
          <label className="block text-slate-300 font-bold mb-2">Select Content Type:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { id: 'article', label: 'Article', icon: FileText },
              { id: 'video', label: 'Video', icon: Video },
              { id: 'transcript', label: 'Transcript', icon: FileCode },
              { id: 'caption', label: 'Caption', icon: FileText },
              { id: 'course', label: 'Course', icon: GraduationCap },
              { id: 'news', label: 'News', icon: Newspaper },
              { id: 'research', label: 'Research', icon: BookOpen }
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = type === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-navy-900/60 hover:bg-navy-900 border-indigo-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-[11px] capitalize">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            {type === 'news' ? 'News Headline' : type === 'course' ? 'Course Title' : 'Media Title'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Breakthroughs in Generative AI and Diffusion Synthesis"
            className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Metadata Row: Topic, Author, Source */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Primary Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Machine Learning, Python, etc."
              className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Author / Lead Researcher</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Source / Publication</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="MediaMine Labs"
              className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="generative ai, neural networks, computer vision"
            className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
          />
        </div>

        {/* Summary / Description */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Executive Summary / Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short introductory overview of the media document..."
            className="w-full bg-navy-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
          />
        </div>

        {/* Dynamic Type-specific fields */}
        {type === 'video' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Video Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="32:15"
                className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Transcript Preview</label>
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Verbatim audio transcript snippet"
                className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>
          </div>
        )}

        {type === 'research' && (
          <div>
            <label className="block text-slate-300 font-bold mb-1">Scholarly Abstract</label>
            <textarea
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Abstract outlining methodology, proofs, and experimental findings..."
              className="w-full bg-navy-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
            />
          </div>
        )}

        {type === 'course' && (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Syllabus Modules (one per line)</label>
              <textarea
                rows={4}
                value={syllabusInput}
                onChange={(e) => setSyllabusInput(e.target.value)}
                className="w-full bg-navy-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-mono"
              />
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            {type === 'transcript' ? 'Verbatim Transcript' : 'Full Content / Article Text'}
          </label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write or paste full text content here. It will be indexed via inverted token index and scanned via KMP and Aho-Corasick..."
            className="w-full bg-navy-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 font-sans leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-indigo-950/60">
          <button
            type="button"
            onClick={() => navigate('/admin/media')}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2"
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Publish & Index Document</span>
          </button>
        </div>
      </form>
    </div>
  );
}
