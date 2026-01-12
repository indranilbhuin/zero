import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useMemo} from 'react';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import CustomToast from '../../components/molecules/CustomToast';
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
        return <Icon name="check-circle" size={20} color={colors.accentGreen} />;
      case 'error':
        return <Icon name="x-circle" size={20} color={colors.accentRed} />;
      default:
        return <Icon name="circle" size={20} color={colors.secondaryText} />;
    }
  }, [status, colors.accentGreen, colors.accentRed, colors.secondaryText]);

  const statusColor = useMemo(() => {
    switch (status) {
      case 'syncing':
        return colors.accentOrange;
      case 'done':
        return colors.accentGreen;
      case 'error':
        return colors.accentRed;
      default:
        return colors.secondaryText;
    }
  }, [status, colors.accentOrange, colors.accentGreen, colors.accentRed, colors.secondaryText]);

  return (
    <View style={[gs.rowCenter, gs.py10]}>
      {statusIcon}
      <PrimaryText style={[gs.ml10, gs.flex1]} color={statusColor}>{label}</PrimaryText>
      {status === 'done' && count !== undefined && count > 0 && (
        <PrimaryText size={12} color={colors.secondaryText}>{count} items</PrimaryText>
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
    isStorageModalVisible,
    handleAccessStorageOk,
    handleAccessStorageCancel,
  } = useExistingUser();

  const showSyncProgress = isSyncing || isSyncComplete;

  return (
    <>
      <PrimaryView colors={colors} style={gs.justifyBetween}>
        <View>
          <View style={gs.pt10p}>
            <PrimaryText size={20}>As an existing user if you have exported your data,</PrimaryText>
            <PrimaryText size={15} color={colors.accentGreen} style={gs.pt10p}>
              Upload your <Text style={{color: colors.accentGreen}}>zero***.json</Text> file
              {'\n'}we will sync your data automatically
            </PrimaryText>
          </View>

          <View style={[gs.rowCenter, gs.mt5p]}>
            <View
              style={[
                gs.size50,
                gs.border2,
                gs.center,
                gs.rounded10,
                gs.mr10,
                {
                  backgroundColor: isSyncComplete ? colors.accentGreen : colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                },
              ]}>
              <TouchableOpacity style={gs.center} onPress={importData} disabled={isSyncing}>
                {isSyncing ? (
                  <ActivityIndicator size="small" color={colors.accentGreen} />
                ) : isSyncComplete ? (
                  <Icon name="check" size={25} color={colors.buttonText} />
                ) : (
                  <Icon name="upload" size={25} color={colors.accentGreen} />
                )}
              </TouchableOpacity>
            </View>
            <View style={gs.flex1}>
              {fileName ? (
                <>
                  <PrimaryText size={13}>
                    {isSyncComplete ? 'Synced' : 'Syncing'} {fileName}
                  </PrimaryText>
                  {!isSyncing && (
                    <TouchableOpacity onPress={reUpload}>
                      <PrimaryText size={13} color={colors.accentOrange}>Upload different file</PrimaryText>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <PrimaryText size={13}>{uploadMessage}</PrimaryText>
              )}
            </View>
          </View>

          {showSyncProgress && (
            <View style={[gs.mt30, gs.py20]}>
              <PrimaryText size={16} color={isSyncComplete ? colors.accentGreen : colors.primaryText} style={gs.mb15}>
                {isSyncComplete ? 'Sync Complete!' : 'Syncing your data...'}
              </PrimaryText>

              <SyncStatusItem label="User Profile" status={syncStatus.user} colors={colors} />
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
      <CustomToast
        visible={isStorageModalVisible}
        message={'You need to manually give permission for the storage to upload your data'}
        type="warning"
        onOk={handleAccessStorageOk}
        onCancel={handleAccessStorageCancel}
      />
    </>
  );
};

export default ExistingUserScreen;
