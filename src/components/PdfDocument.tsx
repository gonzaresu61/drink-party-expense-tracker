import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { AppState, Summary } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1f2937',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: '#dc2626',
  },
  balanceLabelSurplus: {
    color: '#16a34a',
  },
  balanceValue: {
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
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
  '¥' + new Intl.NumberFormat('ja-JP').format(amount);

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
          {party.title || '飲み会精算表'}
        </Text>
        <Text style={styles.subtitle}>
          {party.date}
          {party.memo ? `　${party.memo}` : ''}
        </Text>

        {/* Summary */}
        <Text style={styles.sectionTitle}>精算サマリー</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>支払合計</Text>
            <Text style={styles.summaryValue}>{fmtJpy(summary.totalPayment)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>徴収合計</Text>
            <Text style={styles.summaryValue}>{fmtJpy(summary.totalCollected)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>参加者数</Text>
            <Text style={styles.summaryValue}>{summary.totalCount}名</Text>
          </View>
          <View style={{ ...styles.summaryRow, marginBottom: 0 }}>
            <Text style={styles.summaryLabel}>徴収済</Text>
            <Text style={styles.summaryValue}>{summary.paidCount}/{summary.totalCount}名</Text>
          </View>
        </View>

        <View style={[styles.balanceBox, !isShortfall && summary.balance !== 0 ? styles.balanceBoxSurplus : {}]}>
          <Text style={[styles.balanceLabel, !isShortfall && summary.balance !== 0 ? styles.balanceLabelSurplus : {}]}>
            {isShortfall ? '不足' : summary.balance === 0 ? 'ちょうど！' : '余剰'}
          </Text>
          <Text style={[styles.balanceValue, !isShortfall && summary.balance !== 0 ? styles.balanceValueSurplus : {}]}>
            {isShortfall ? '-' : summary.balance !== 0 ? '+' : ''}
            {fmtJpy(Math.abs(summary.balance))}
          </Text>
        </View>

        {/* Participant details */}
        <Text style={styles.sectionTitle}>参加者明細</Text>
        {summary.groupSummaries.map((gs, i) => (
          <View key={gs.group?.id ?? `ungrouped-${i}`}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupHeaderText}>
                {gs.group ? gs.group.name : 'グループなし'}
                {'　'}({gs.memberCount}名)
              </Text>
              <Text style={styles.groupHeaderText}>小計: {fmtJpy(gs.subtotal)}</Text>
            </View>
            {gs.participants.map((p) => (
              <View key={p.id} style={styles.participantRow}>
                <Text style={styles.participantName}>{p.name}</Text>
                <Text style={styles.participantPaid}>{p.isPaid ? '受取済' : ''}</Text>
                <Text style={styles.participantAmount}>
                  {p.amount !== null ? fmtJpy(p.amount) : '未入力'}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>飲み会会計アプリ</Text>
          <Text style={styles.footerText}>作成: {now}</Text>
        </View>
      </Page>
    </Document>
  );
}
