import { View, Text, StyleSheet, FlatList } from 'react-native';

const mockData = [
  {
    id: '1',
    deviceId: 'ص/1/ق/2/ج/1',
    date: '2024-02-20',
    type: 'سكينة',
    status: 'مكتمل',
  },
  {
    id: '2',
    deviceId: 'ع/2/ق/1/ج/3',
    date: '2024-02-19',
    type: 'جهاز',
    status: 'مكتمل',
  },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.deviceId}>{item.deviceId}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>النوع:</Text>
                <Text style={styles.value}>{item.type}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>الحالة:</Text>
                <Text style={[styles.value, styles.status]}>{item.status}</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 70, // Account for fixed tab bar
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceId: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
  },
  status: {
    color: '#059669',
  },
});
