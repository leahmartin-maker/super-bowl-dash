import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PropBetAdminProps {
  onClose: () => void;
}

export default function PropBetAdmin({ onClose }: PropBetAdminProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('prop_bet_questions')
        .select('*');
      if (!error && data) setQuestions(data);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const pickWinner = async (questionId: string, answer: string) => {
    await supabase
      .from('prop_bet_questions')
      .update({ correct_answer: answer, closed: true })
      .eq('id', questionId);
    setQuestions((prev) => prev.map(q => q.id === questionId ? { ...q, correct_answer: answer, closed: true } : q));
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg mx-auto">
      <h2 className="text-lg font-black mb-4 text-green-700">Admin: Pick Prop Bet Winners</h2>
      <button className="absolute top-2 right-2 text-xl text-black hover:text-red-600 font-bold" onClick={onClose}>&times;</button>
      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q.id} className="border-b pb-2">
            <div className="font-bold mb-1">{q.question}</div>
            <div className="flex flex-wrap gap-2">
              {q.options && Array.isArray(q.options) && q.options.map((opt: any) => (
                <button
                  key={opt.id}
                  className={`px-3 py-1 rounded font-bold border ${q.correct_answer === opt.id ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-800'}`}
                  disabled={q.closed}
                  onClick={() => pickWinner(q.id, opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {q.closed && <div className="text-green-700 font-bold mt-1">Closed</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
