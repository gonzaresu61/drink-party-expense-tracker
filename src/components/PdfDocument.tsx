import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { AppState, Summary } from '../types';

// NotoSansJP を登録（日本語対応）
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

// ハイフネーション無効化（日本語テキストが途中で切れるのを防ぐ）
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'NotoSansJP',
    fontSize: 10,
    color: '#1f2937',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8,
    marginTop: 16,
    color: '#374151',
  },
  summaryBox: {
    border: '1pt solid #e5e7eb',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    color: '#6b7280',
  },
  summaryValue: {
    fontWeight: 700,
  },
  balanceBox: {
    border: '1pt solid #fca5a5',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fef2f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceBoxSurplus: {
    border: '1pt solid #6ee7b7',
    backgroundColor: '#f0fdf4',
  },
  balanceLabel: {
    fontWeight: 700,
    fontSize: 12,
    color: '#dc2626',
  },
  balanceLabelSurplus: {
    color: '#16a34a',
  },
  balanceValue: {
    fontWeight: 700,
    fontSize: 14,
    color: '#dc2626',
  },
  balanceValueSurplus: {
    color: '#16a34a',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e0e7ff',
    padding: '6 10',
    borderRadius: 4,
    marginBottom: 2,
  },
  groupHeaderText: {
    fontWeight: 700,
    fontSize: 10,
    color: '#3730a3',
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottom: '0.5pt solid #f3f4f6',
  },
  participantName: {
    flex: 1,
    fontSize: 10,
  },
  participantPaid: {
    width: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#16a34a',
  },
  participantAmount: {
    width: 70,
    textAlign: 'right',
    fontWeight: 700,
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '0.5pt solid #e5e7eb',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
});

const fmtJpy = (amount: number) =>
  '\u00a5' + new Intl.NumberFormat('ja-JP').format(amount);

interface Props {
  state: AppState;
  summary: Summary;
}

export function PdfDocument({ state, summary }: Props) {
  const { party } = state;
  const isShortfall = summary.balance > 0;
  const now = new Date().toLocaleString('ja-JP');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.title}>
          {party.title || '\u98f2\u307f\u4f1a\u7cbe\u7b97\u8868'}
        </Text>
        <Text style={styles.subtitle}>
          {party.date}
          {party.memo ? `\u3000${party.memo}` : ''}
        </Text>

        {/* Summary */}
        <Text style={styles.sectionTitle}>\u7cbe\u7b97\u30b5\u30de\u30ea\u30fc</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>\u652f\u6255\u5408\u8a08</Text>
            <Text style={styles.summaryValue}>{fmtJpy(summary.totalPayment)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>\u5fb4\u53ce\u5408\u8a08</Text>
            <Text style={styles.summaryValue}>{fmtJpy(summary.totalCollected)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>\u53c2\u52a0\u8005\u6570</Text>
            <Text style={styles.summaryValue}>{summary.totalCount}\u540d</Text>
          </View>
          <View style={{ ...styles.summaryRow, marginBottom: 0 }}>
            <Text style={styles.summaryLabel}>\u5fb4\u53ce\u6e08</Text>
            <Text style={styles.summaryValue}>{summary.paidCount}/{summary.totalCount}\u540d</Text>
          </View>
        </View>

        <View style={[styles.balanceBox, !isShortfall && summary.balance !== 0 ? styles.balanceBoxSurplus : {}]}>
          <Text style={[styles.balanceLabel, !isShortfall && summary.balance !== 0 ? styles.balanceLabelSurplus : {}]}>
            {isShortfall ? '\u4e0d\u8db3' : summary.balance === 0 ? '\u3061\u3087\u3046\u3069\uff01' : '\u4f59\u5270'}
          </Text>
          <Text style={[styles.balanceValue, !isShortfall && summary.balance !== 0 ? styles.balanceValueSurplus : {}]}>
            {isShortfall ? '-' : summary.balance !== 0 ? '+' : ''}
            {fmtJpy(Math.abs(summary.balance))}
          </Text>
        </View>

        {/* Participant details */}
        <Text style={styles.sectionTitle}>\u53c2\u52a0\u8005\u660e\u7d30</Text>
        {summary.groupSummaries.map((gs, i) => (
          <View key={gs.group?.id ?? `ungrouped-${i}`}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupHeaderText}>
                {gs.group ? gs.group.name : '\u30b0\u30eb\u30fc\u30d7\u306a\u3057'}
                {'\u3000'}({gs.memberCount}\u540d)
              </Text>
              <Text style={styles.groupHeaderText}>\u5c0f\u8a08: {fmtJpy(gs.subtotal)}</Text>
            </View>
            {gs.participants.map((p) => (
              <View key={p.id} style={styles.participantRow}>
                <Text style={styles.participantName}>{p.name}</Text>
                <Text style={styles.participantPaid}>{p.isPaid ? '\u53d7\u53d6\u6e08' : ''}</Text>
                <Text style={styles.participantAmount}>
                  {p.amount !== null ? fmtJpy(p.amount) : '\u672a\u5165\u529b'}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>\u98f2\u307f\u4f1a\u4f1a\u8a08\u30a2\u30d7\u30ea</Text>
          <Text style={styles.footerText}>\u4f5c\u6210: {now}</Text>
        </View>
      </Page>
    </Document>
  );
}
