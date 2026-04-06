import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import React, {memo, useMemo} from 'react';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import useExistingUser from './useExistingUser';
import {gs} from '../../styles/globalStyles';

const SyncStatusItem = memo(({
  label,
  status,
  count,
  colors,
}: {
  label: string;
  status: 'pending' | 'syncing' | 'done' | 'error';
  count?: number;
  colors: any;
}) => {
  const statusIcon = useMemo(() => {
    switch (status) {
      case 'syncing':
        return <ActivityIndicator size="small" color={colors.accentGreen} />;
      case 'done':
        return <Icon name="check-circle" size={18} color={colors.accentGreen} />;
      case 'error':
        return <Icon name="x-circle" size={18} color={colors.accentRed} />;
      default:
        return <Icon name="circle" size={18} color={colors.secondaryAccent} />;
    }
  }, [status, colors]);

  return (
    <View style={[gs.rowCenter, gs.py10, {borderBottomWidth: 0.5, borderBottomColor: colors.secondaryAccent}]}>
      {statusIcon}
      <PrimaryText size={13} style={[gs.ml12, gs.flex1]} color={status === 'done' ? colors.primaryText : colors.secondaryText}>
        {label}
      </PrimaryText>
      {status === 'done' && count !== undefined && count > 0 && (
        <PrimaryText size={12} color={colors.secondaryText} variant="number">{count}</PrimaryText>
      )}
    </View>
  );
});

const ExistingUserScreen = () => {
  const {
    colors,
    importData,
    fileName,
    uploadMessage,
    reUpload,
    handleContinue,
    isSyncing,
    isSyncComplete,
    syncStatus,
    syncStats,
  } = useExistingUser();

  const showSyncProgress = isSyncing || isSyncComplete;

  return (
    <PrimaryView colors={colors} style={gs.justifyBetween}>
      <View>
          <View style={gs.pt10p}>
            <PrimaryText size={28} weight="bold">Restore your</PrimaryText>
            <PrimaryText size={28} weight="bold">data</PrimaryText>
          </View>

          <PrimaryText size={14} color={colors.secondaryText} style={gs.mt6}>
            Upload your exported zero backup file
          </PrimaryText>

          <TouchableOpacity
            onPress={importData}
            disabled={isSyncing}
            activeOpacity={0.7}
            style={[
              gs.mt30,
              gs.py12,
              gs.px14,
              gs.rounded12,
              gs.rowCenter,
              {backgroundColor: colors.containerColor},
            ]}>
            <View
              style={[
                gs.size40,
                gs.roundedFull,
                gs.center,
                gs.mr10,
                {backgroundColor: isSyncComplete ? colors.accentGreen : colors.secondaryAccent},
              ]}>
              {isSyncing ? (
                <ActivityIndicator size="small" color={colors.accentGreen} />
              ) : isSyncComplete ? (
                <Icon name="check" size={20} color={colors.buttonText} />
              ) : (
                <Icon name="upload" size={20} color={colors.secondaryText} />
              )}
            </View>
            <View style={gs.flex1}>
              {fileName ? (
                <>
                  <PrimaryText size={13} weight="medium" numberOfLines={1}>
                    {fileName}
                  </PrimaryText>
                  <PrimaryText size={11} color={isSyncComplete ? colors.accentGreen : colors.secondaryText}>
                    {isSyncComplete ? 'Sync complete' : 'Syncing...'}
                  </PrimaryText>
                </>
              ) : (
                <>
                  <PrimaryText size={13} weight="medium">{uploadMessage}</PrimaryText>
                  <PrimaryText size={11} color={colors.secondaryText}>Tap to select file</PrimaryText>
                </>
              )}
            </View>
          </TouchableOpacity>

          {fileName && !isSyncing && (
            <TouchableOpacity onPress={reUpload} style={gs.mt10}>
              <PrimaryText size={12} color={colors.accentOrange}>Upload different file</PrimaryText>
            </TouchableOpacity>
          )}

          {showSyncProgress && (
            <View style={gs.mt30}>
              <PrimaryText size={14} weight="semibold" color={isSyncComplete ? colors.accentGreen : colors.primaryText} style={gs.mb10}>
                {isSyncComplete ? 'All done' : 'Syncing your data...'}
              </PrimaryText>

              <SyncStatusItem label="Profile" status={syncStatus.user} colors={colors} />
              <SyncStatusItem label="Categories" status={syncStatus.categories} count={syncStats.categories} colors={colors} />
              <SyncStatusItem label="Expenses" status={syncStatus.expenses} count={syncStats.expenses} colors={colors} />
              <SyncStatusItem label="Debtors" status={syncStatus.debtors} count={syncStats.debtors} colors={colors} />
              <SyncStatusItem label="Debts" status={syncStatus.debts} count={syncStats.debts} colors={colors} />
              <SyncStatusItem label="Currency" status={syncStatus.currencies} colors={colors} />
            </View>
          )}
        </View>

      <PrimaryButton onPress={handleContinue} colors={colors} buttonTitle={'Continue'} disabled={!isSyncComplete} />
    </PrimaryView>
  );
};

export default ExistingUserScreen;
