import { createClient } from '@/lib/supabase/server';
import { getResponses } from '@/lib/queries/responses';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('No autorizado', { status: 401 });
    }

    // Verify administrator authorization
    const { data: isAdmin, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!isAdmin || adminError) {
      return new NextResponse('No autorizado', { status: 403 });
    }

    // Retrieve active search parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      subject: searchParams.get('subject') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      search: searchParams.get('search') || undefined,
    };

    // Get filtered responses
    const responses = await getResponses(filters);

    // CSV Headers
    const headers = [
      'Fecha',
      'Materia',
      'Actividades que ayudaron',
      'Otra actividad',
      'Tema no claro',
      'Tema para trabajar más',
      'Recomendación sobre trabajo final',
      'Actividad para mantener',
      'Recomendación de mejora',
      'Comentario adicional',
    ];

    // Format helper to escape CSV values
    const escapeCsv = (val: string | string[] | null | undefined): string => {
      if (val === null || val === undefined) return '';
      
      let strValue = '';
      if (Array.isArray(val)) {
        strValue = val.join(', ');
      } else {
        strValue = val;
      }
      
      // Escape double quotes by doubling them
      const escaped = strValue.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...responses.map((res) => {
        return [
          escapeCsv(res.created_at),
          escapeCsv(res.subject),
          escapeCsv(res.helpful_activities),
          escapeCsv(res.other_activity),
          escapeCsv(res.unclear_topic),
          escapeCsv(res.more_practical_topic),
          escapeCsv(res.final_project_feedback),
          escapeCsv(res.keep_next_semester),
          escapeCsv(res.improve_next_semester),
          escapeCsv(res.additional_comment),
        ].join(',');
      }),
    ];

    // UTF-8 with BOM prefix so Excel reads Spanish accents (ñ, á, é, í, ó, ú) correctly
    const BOM = '\uFEFF';
    const csvContent = BOM + csvRows.join('\n');

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `recomendaciones_cursos_${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('Error generating CSV export:', err);
    return new NextResponse('Error interno del servidor', { status: 500 });
  }
}
