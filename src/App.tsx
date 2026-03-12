/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Volume2, Loader2, RotateCw } from 'lucide-react';

const contexts = [
  {
    title: "聽說 (Tīngshuō)",
    description: "Expressing opinions indirectly",
    example: "聽說那部電影不好看。(Tīngshuō nà bù diànyǐng bù hǎokàn.)",
    translation: "I heard that movie isn't very good."
  },
  {
    title: "比較 (Bǐjiào)",
    description: "Expressing personal preference indirectly",
    example: "我比較常去運動。(Wǒ bǐjiào cháng qù yùndòng.)",
    translation: "I usually prefer to exercise alone."
  },
  {
    title: "但是 (Dànshì)",
    description: "Softening refusal with contrast",
    example: "我有空，但是我有事。(Wǒ yǒu kòng, dànshì wǒ yǒushì.)",
    translation: "I'm free, but I have something to do."
  },
  {
    title: "可能 (Kěnéng)",
    description: "Softening refusal with uncertainty",
    example: "這個週末可能沒有空。(Zhège zhōumò kěnéng méiyǒu kòng.)",
    translation: "I might not be free this weekend."
  },
  {
    title: "不好意思 (Bù hǎo yì si)",
    description: "Polite reminder",
    example: "不好意思，下次運動可以請你準時嗎？(Bù hǎo yì si, xià cì yùndòng kěyǐ qǐng nǐ zhǔnshí ma?)",
    translation: "Excuse me, could you please be on time next time we exercise?"
  },
  {
    title: "想一下 (Xiǎng yīxià)",
    description: "Delaying response / soft refusal",
    example: "價格有點高，我想一下。(Jiàgé yǒudiǎn gāo, wǒ xiǎng yīxià.)",
    translation: "The price is a bit high, let me think about it."
  },
  {
    title: "好像 (Hǎoxiàng)",
    description: "Softening judgment",
    example: "他今天好像不太高興。(Tā jīntiān hǎoxiàng bù tài gāoxìng.)",
    translation: "He seems a bit unhappy today."
  },
  {
    title: "動詞重疊 (Dòngcí chóngdié)",
    description: "Softening tone",
    example: "我給你介紹介紹。(Wǒ gěi nǐ jièshào jièshào.)",
    translation: "They are my classmates, let me introduce them to you."
  }
];

interface FlashcardProps {
  ctx: typeof contexts[0];
  audioBuffers: Record<string, AudioBuffer>;
  playAudio: (text: string) => Promise<void>;
}

const Flashcard: React.FC<FlashcardProps> = (props) => {
  const { ctx, audioBuffers, playAudio } = props;
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="group h-96 w-full [perspective:1000px]" onClick={() => setFlipped(!flipped)}>
      <div className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-6 shadow-sm [backface-visibility:hidden]">
          <h2 className="mb-4 text-2xl font-bold text-stone-900">{ctx.title}</h2>
          <p className="mb-6 text-center text-stone-600">{ctx.description}</p>
          <div className="flex w-full items-center justify-between rounded-lg bg-stone-50 p-4 font-mono text-sm text-stone-700">
            <span>{ctx.example}</span>
            <button
              onClick={(e) => { e.stopPropagation(); playAudio(ctx.example); }}
              disabled={!audioBuffers[ctx.example]}
              className="rounded-full p-2 hover:bg-stone-200 disabled:opacity-50"
            >
              {!audioBuffers[ctx.example] ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
            </button>
          </div>
          <div className="mt-4 flex items-center text-stone-400">
            <RotateCw size={16} className="mr-1" /> Click to flip
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-6 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="mb-6 text-center text-lg text-stone-800">{ctx.translation}</p>
          <div className="flex justify-center">
            <iframe width="400" height="225" src="https://www.youtube.com/embed/EgZKSWjwtok" title="Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
          <div className="mt-4 flex items-center text-stone-400">
            <RotateCw size={16} className="mr-1" /> Click to flip
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [audioBuffers, setAudioBuffers] = useState<Record<string, AudioBuffer>>({});
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    
    const prefetchAudio = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const buffers: Record<string, AudioBuffer> = {};
      
      for (const ctx of contexts) {
        let retries = 3;
        let delay = 5000;
        
        while (retries > 0) {
          try {
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash-preview-tts",
              contents: [{ parts: [{ text: ctx.example }] }],
              config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                  },
                },
              },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const binaryString = window.atob(base64Audio);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              
              const audioBuffer = audioContextRef.current.createBuffer(1, bytes.length / 2, 24000);
              const channelData = audioBuffer.getChannelData(0);
              const pcm16 = new Int16Array(bytes.buffer);
              for (let i = 0; i < pcm16.length; i++) {
                channelData[i] = pcm16[i] / 32768;
              }
              buffers[ctx.example] = audioBuffer;
            }
            break; // Success
          } catch (error: any) {
            const isRateLimit = error.message?.includes('429') || error.status === 429;
            if (isRateLimit && retries > 1) {
              retries--;
              await sleep(delay);
              delay *= 2; // Exponential backoff
            } else {
              console.error(`Error prefetching audio for ${ctx.example}:`, error);
              break; // Give up
            }
          }
        }
      }
      setAudioBuffers(buffers);
    };

    prefetchAudio();
  }, []);

  const playAudio = async (text: string) => {
    if (audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      if (audioBuffers[text]) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffers[text];
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <h1 className="mb-8 text-center text-4xl font-bold text-stone-900">中文委婉語表達 (Chinese Euphemistic Expressions)</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {contexts.map((ctx, index) => (
          <Flashcard key={index} ctx={ctx} audioBuffers={audioBuffers} playAudio={playAudio} />
        ))}
      </div>
    </div>
  );
}
