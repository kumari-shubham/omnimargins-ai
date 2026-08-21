import { NextRequest, NextResponse } from 'next/server';
import { generateAgentDeliberation, executeNaturalLanguageQuery } from '@/lib/gemini';
import { PRESET_DATASETS } from '@/lib/datasets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, dataset, datasetId, query, apiKey } = body;

    let targetDataset = dataset;
    if (!targetDataset && datasetId) {
      targetDataset = PRESET_DATASETS.find((d) => d.id === datasetId) || PRESET_DATASETS[0];
    }

    if (!targetDataset) {
      return NextResponse.json({ error: 'No dataset provided' }, { status: 400 });
    }

    if (action === 'deliberate') {
      const insights = await generateAgentDeliberation(targetDataset, apiKey || process.env.GEMINI_API_KEY);
      return NextResponse.json({ insights });
    }

    if (action === 'query') {
      if (!query) {
        return NextResponse.json({ error: 'Query string is required' }, { status: 400 });
      }
      const result = await executeNaturalLanguageQuery(query, targetDataset, apiKey || process.env.GEMINI_API_KEY);
      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/analyze error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
