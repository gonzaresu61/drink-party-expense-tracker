import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { AppState, CalcResult } from '../types';

Font.register({
  family: 'NotoSansJP',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5/files/noto-sans-jp-japanese-400-normal.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-jp@5/files/noto-sans-jp-japanese-700-normal.woff2',
      fontWeight: 700,
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'NotoSansJP', fontSize: 10, color: '#1f2937' },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 2 },
  sub: { fontSize: 10, color: '#6b7280', marginBottom: 20 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 6, marginTop: 14, color: '#374151' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  label: { color: '#6b7280' },
  val: { fontWeight: 700 },
  box: { border: '1pt solid #e5e7eb', borderRadius: 4, padding: 10, backgroundColor: '#f9fafb', marginBottom: 8 },
  resultBox: { backgroundColor: '#4f46e5', borderRadius: 4, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#e0e7ff', padding: '5 8', borderRadius: 3, marginBottom: 1 },
  groupHeaderText: { fontWeight: 700, fontSize: 10, color: '#3730a3' },
  memberRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, paddingHorizontal: 8, borderBottom: '0.5pt solid #f3f4f6' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTop: '0.5pt solid #e5e7eb', paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#9ca3af' },
});

const fmtAmt = (n: number) =>
  Number.isInteger(n)
    ? '¥' + n.toLocaleString('ja-JP')
    : '¥' + n.toFixed(2);

interface Props { state: AppState; calc: CalcResult; }

export function PdfDocument({ state, calc }: Props) {
  const { event, groups, members } = state;
  const now = new Date().toLocaleString('ja-JP');

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.title}>{event.title || '飲み会精算表'}</Text>
        <Text style={s.sub}>
          {event.date}
          {event.venue ? `　·　${event.venue}` : ''}
        </Text>

        <Text style={s.sectionTitle}>負担金額</Text>
        <View style={s.box}>
          {groups.map((g) => {
            const pp = calc.perGroup[g.id] ?? 0;
            return (
              <View key={g.id} style={s.row}>
                <Text style={s.label}>
                  {g.name || 'グループ'}（{g.count}名）
                  {g.amountMode === 'auto' ? '　←自動計算' : ''}
                </Text>
                <Text style={s.val}>{fmtAmt(pp)} / 人</Text>
              </View>
            );
          })}
        </View>

        {calc.autoAmount !== null && (
          <View style={s.resultBox}>
            <Text style={{ color: '#c7d2fe', fontSize: 10 }}>
              自動計算グループ {calc.autoCount}名
            </Text>
            <Text style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
              {fmtAmt(calc.autoAmount)} / 人
            </Text>
          </View>
        )}

        <Text style={s.sectionTitle}>精算サマリー</Text>
        <View style={s.box}>
          <View style={s.row}>
            <Text style={s.label}>総額</Text>
            <Text style={s.val}>{fmtAmt(calc.total)}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>合計人数</Text>
            <Text style={s.val}>{calc.totalHeadcount}名</Text>
          </View>
          {event.unitPrice && event.attendeeCount && (
            <View style={{ ...s.row, marginBottom: 0 }}>
              <Text style={s.label}>1人当たり料金</Text>
              <Text style={s.val}>{fmtAmt(event.unitPrice)} × {event.attendeeCount}名</Text>
            </View>
          )}
        </View>

        {members.length > 0 && (
          <>
            <Text style={s.sectionTitle}>征収明細</Text>
            {groups.map((g) => {
              const gMembers = members.filter((m) => m.groupId === g.id);
              if (gMembers.length === 0) return null;
              const pp = calc.perGroup[g.id] ?? 0;
              return (
                <View key={g.id}>
                  <View style={s.groupHeader}>
                    <Text style={s.groupHeaderText}>{g.name || 'グループ'}（{gMembers.length}名）</Text>
                    <Text style={s.groupHeaderText}>{fmtAmt(pp)} / 人</Text>
                  </View>
                  {gMembers.map((m) => (
                    <View key={m.id} style={s.memberRow}>
                      <Text>{m.name || '名前未記入'}</Text>
                      <Text style={{ color: m.isPaid ? '#16a34a' : '#9ca3af' }}>
                        {m.isPaid ? '受取済' : '未征収'}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </>
        )}

        {event.notes ? (
          <>
            <Text style={s.sectionTitle}>備考</Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>{event.notes}</Text>
          </>
        ) : null}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>飲み会会計アプリ</Text>
          <Text style={s.footerText}>作成: {now}</Text>
        </View>
      </Page>
    </Document>
  );
}
