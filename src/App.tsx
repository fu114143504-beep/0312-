/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

const contexts = [
  {
    title: "聽說 (Tīngshuō)",
    description: "Expressing opinions indirectly",
    example: "聽說那部電影不好看。(Tīngshuō nà bù diànyǐng bù hǎokàn.)",
    translation: "I heard that movie isn't very good.",
    contextExplanation: "Politely indicating that the speaker does not want to watch the movie.",
    videoUrl: "https://www.youtube.com/embed/EgZKSWjwtok"
  },
  {
    title: "比較 (Bǐjiào)",
    description: "Expressing personal preference indirectly",
    example: "我比較常去運動。(Wǒ bǐjiào cháng qù yùndòng.)",
    translation: "I usually prefer to exercise alone.",
    contextExplanation: "Politely indicating that the speaker prefers to exercise alone.",
    videoUrl: "https://www.youtube.com/embed/EgZKSWjwtok"
  },
  {
    title: "但是 (Dànshì)",
    description: "Softening refusal with contrast",
    example: "我有空，但是我有事。(Wǒ yǒu kòng, dànshì wǒ yǒushì.)",
    translation: "I'm free, but I have something to do.",
    contextExplanation: "Politely indicating that the speaker does not want to meet.",
    videoUrl: "https://www.youtube.com/embed/EgZKSWjwtok"
  },
  {
    title: "可能 (Kěnéng)",
    description: "Softening refusal with uncertainty",
    example: "這個週末可能沒有空。(Zhège zhōumò kěnéng méiyǒu kòng.)",
    translation: "I might not be free this weekend.",
    contextExplanation: "Polite refusal.",
    videoUrl: "https://www.youtube.com/embed/EgZKSWjwtok"
  },
  {
    title: "不好意思 (Bù hǎo yì si)",
    description: "Polite reminder",
    example: "不好意思，下次運動可以請你準時嗎？(Bù hǎo yì si, xià cì yùndòng kěyǐ qǐng nǐ zhǔnshí ma?)",
    translation: "Excuse me, could you please be on time next time we exercise?",
    contextExplanation: "Politely pointing out that the person was late last time.",
    videoUrl: "https://www.youtube.com/embed/EgZKSWjwtok"
  },
  {
    title: "想一下 (Xiǎng yīxià)",
    description: "Delaying response / soft refusal",
    example: "價格有點高，我想一下。(Jiàgé yǒudiǎn gāo, wǒ xiǎng yīxià.)",
    translation: "The price is a bit high, let me think about it.",
    contextExplanation: "Politely indicating that the price is too high.",
    videoUrl: "https://www.youtube.com/embed/EgZKSWjwtok"
  },
  {
    title: "好像 (Hǎoxiàng)",
    description: "Softening judgment",
    example: "他今天好像不太高興。(Tā jīntiān hǎoxiàng bù tài gāoxìng.)",
    translation: "He seems a bit unhappy today.",
    contextExplanation: "Indirectly suggesting that others should not argue with him.",
    videoUrl: "https://www.youtube.com/embed/EgZKSWjwtok"
  },
  {
    title: "動詞重疊 (Dòngcí chóngdié)",
    description: "Softening tone",
    example: "我給你介紹介紹。(Wǒ gěi nǐ jièshào jièshào.)",
    translation: "They are my classmates, let me introduce them to you.",
    contextExplanation: "The second sentence sounds more polite and softer.",
    videoUrl: "https://www.youtube.com/embed/EgZKSWjwtok"
  }
];

interface FlashcardProps {
  ctx: typeof contexts[0];
}

const Flashcard: React.FC<FlashcardProps> = (props) => {
  const { ctx } = props;
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="group h-96 w-full [perspective:1000px]" onClick={() => setFlipped(!flipped)}>
      <div className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-6 shadow-sm [backface-visibility:hidden]">
          <h2 className="mb-4 text-2xl font-bold text-stone-900">{ctx.title}</h2>
          <p className="mb-6 text-center text-stone-600">{ctx.description}</p>
          <div className="flex w-full items-center justify-center rounded-lg bg-stone-50 p-4 font-mono text-sm text-stone-700">
            <span>{ctx.example}</span>
          </div>
          <div className="mt-4 flex items-center text-stone-400">
            <RotateCw size={16} className="mr-1" /> Click to flip
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-6 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="mb-2 text-center text-lg font-bold text-stone-800">{ctx.translation}</p>
          <p className="mb-4 text-center text-sm text-stone-600 italic">{ctx.contextExplanation}</p>
          <div className="flex justify-center">
            <iframe width="400" height="225" src={ctx.videoUrl} title="Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
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
  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <h1 className="mb-8 text-center text-4xl font-bold text-stone-900">中文委婉語表達 (Chinese Euphemistic Expressions)</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {contexts.map((ctx, index) => (
          <Flashcard key={index} ctx={ctx} />
        ))}
      </div>
    </div>
  );
}
