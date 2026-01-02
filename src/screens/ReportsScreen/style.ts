import {StyleSheet} from 'react-native';

const reportsStyles = StyleSheet.create({
  categoryContainer: {
    height: 35,
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  toastContainer: {
    height: 500,
    width: '80%',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 0.8,
  },
  yearContainer: {
    padding: 3,
    borderRadius: 5,
    margin: 10,
  },
  selectedYearContainer: {
    paddingBottom: 10,
    borderBottomWidth: 0.8,
  },
  yearListContainer: {
    flex: 1,
    minHeight: 200,
  },
  chartContainer: {
    marginTop: '8%',
    marginBottom: '12%',
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 15
  },
  calendarDay: {
    width: '13.5%',
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0.5,
  },
  heatmapCell: {
    borderRadius: 4,
    borderWidth: 1,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
    gap: 4,
  },
  legendCell: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
  },
  statsCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: 'FiraCode-Regular',
  },
  statsValue: {
    fontSize: 13,
    fontFamily: 'FiraCode-SemiBold',
  },
});


export default reportsStyles;
