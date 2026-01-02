import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import CustomToast from '../../components/molecules/CustomToast';
import styles from './style';
import useExistingUser from './useExistingUser';

const SyncStatusItem = ({
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
  const getStatusIcon = () => {
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
  };

  const getStatusColor = () => {
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
  };

  return (
    <View style={styles.syncStatusItem}>
      {getStatusIcon()}
      <PrimaryText style={{marginLeft: 10, flex: 1, color: getStatusColor()}}>{label}</PrimaryText>
      {status === 'done' && count !== undefined && count > 0 && (
        <PrimaryText style={{color: colors.secondaryText, fontSize: 12}}>{count} items</PrimaryText>
      )}
    </View>
  );
};

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
      <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
        <View>
          <View style={styles.titleTextContainer}>
            <PrimaryText style={{fontSize: 20}}>As an existing user if you have exported your data,</PrimaryText>
            <PrimaryText
              style={{
                color: colors.accentGreen,
                fontSize: 15,
                paddingTop: '10%',
              }}>
              Upload your <Text style={{color: colors.accentGreen}}>zero***.json</Text> file
              {'\n'}we will sync your data automatically
            </PrimaryText>
          </View>

          {/* Upload Button */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '5%',
            }}>
            <View
              style={[
                styles.uploadContainer,
                {
                  backgroundColor: isSyncComplete ? colors.accentGreen : colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                },
              ]}>
              <TouchableOpacity style={styles.uploadContent} onPress={importData} disabled={isSyncing}>
                {isSyncing ? (
                  <ActivityIndicator size="small" color={colors.accentGreen} />
                ) : isSyncComplete ? (
                  <Icon name="check" size={25} color={colors.buttonText} />
                ) : (
                  <Icon name="upload" size={25} color={colors.accentGreen} />
                )}
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              {fileName ? (
                <>
                  <PrimaryText style={{fontSize: 13}}>
                    {isSyncComplete ? 'Synced' : 'Syncing'} {fileName}
                  </PrimaryText>
                  {!isSyncing && (
                    <TouchableOpacity onPress={reUpload}>
                      <PrimaryText style={{fontSize: 13, color: colors.accentOrange}}>
                        Upload different file
                      </PrimaryText>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <PrimaryText style={{fontSize: 13}}>{uploadMessage}</PrimaryText>
              )}
            </View>
          </View>

          {/* Sync Progress */}
          {showSyncProgress && (
            <View style={styles.syncProgressContainer}>
              <PrimaryText
                style={{
                  fontSize: 16,
                  marginBottom: 15,
                  color: isSyncComplete ? colors.accentGreen : colors.primaryText,
                }}>
                {isSyncComplete ? 'Sync Complete!' : 'Syncing your data...'}
              </PrimaryText>

              <SyncStatusItem label="User Profile" status={syncStatus.user} colors={colors} />
              <SyncStatusItem
                label="Categories"
                status={syncStatus.categories}
                count={syncStats.categories}
                colors={colors}
              />
              <SyncStatusItem
                label="Expenses"
                status={syncStatus.expenses}
                count={syncStats.expenses}
                colors={colors}
              />
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
