import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import CustomToast from '../../components/molecules/CustomToast';
import styles from './style';
import useExistingUser from './useExistingUser';

const ExistingUserScreen = () => {
  const {
    colors,
    importRealmData,
    isValidKey,
    fileKey,
    userName,
    uploadMessage,
    fileName,
    reUpload,
    allData,
    allCategoriesCopy,
    populateCategory,
    populate,
    debtorsCopy,
    handleDataSubmit,
    isDisable,
    isStorageModalVisible,
    handleAccessStorageOk,
    handleAccessStorageCancel,
  } = useExistingUser();
  
  return (
    <>
      <PrimaryView colors={colors} style={{justifyContent: 'space-between'}}>
        <View>
          <View style={styles.titleTextContainer}>
            <PrimaryText style={{fontSize: 20}}>
              As an existing user if you have exported your data,
            </PrimaryText>
            <PrimaryText
              style={{
                color: colors.accentGreen,
                fontSize: 15,
                paddingTop: '10%',
              }}>
              Upload your{' '}
              <Text style={{color: colors.accentGreen}}>zero***.json</Text> file
              we will assess your data
            </PrimaryText>
          </View>
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
                  backgroundColor: colors.secondaryAccent,
                  borderColor: colors.secondaryContainerColor,
                },
              ]}>
              <TouchableOpacity
                style={styles.uploadContent}
                onPress={importRealmData}
                disabled={isValidKey(fileKey)}>
                <Icon
                  name={'file-upload'}
                  size={25}
                  color={colors.accentGreen}
                  type={'MaterialCommunityIcons'}
                />
              </TouchableOpacity>
            </View>
            {!userName ? (
              <PrimaryText style={{fontSize: 13, width: '80%'}}>
                {uploadMessage}
              </PrimaryText>
            ) : (
              <View style={{}}>
                <PrimaryText style={{fontSize: 13}}>
                  uploaded {fileName}
                </PrimaryText>
                <TouchableOpacity onPress={reUpload}>
                  <PrimaryText
                    style={{fontSize: 13, color: colors.accentOrange}}>
                    reUpload
                  </PrimaryText>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {isValidKey(fileKey) ? (
            <View style={{marginTop: '5%'}}>
              {allData?.categories.length !== 0 ? (
                <TouchableOpacity
                  disabled={allCategoriesCopy?.length > 0}
                  onPress={populateCategory}>
                  <View
                    style={[
                      styles.settingsContainer,
                      {
                        backgroundColor:
                          allCategoriesCopy?.length > 0
                            ? colors.accentGreen
                            : colors.containerColor,
                        borderColor: colors.secondaryContainerColor,
                        marginBottom: '3%',
                      },
                    ]}>
                    <Icon
                      name={'database-sync'}
                      size={25}
                      color={
                        allCategoriesCopy?.length > 0
                          ? colors.buttonText
                          : colors.primaryText
                      }
                      type={'MaterialCommunityIcons'}
                    />
                    {allCategoriesCopy?.length > 0 ? (
                      <PrimaryText
                        style={{
                          fontSize: 13,
                          color:
                            allCategoriesCopy?.length > 0
                              ? colors.buttonText
                              : colors.primaryText,
                        }}>
                        Synced Expense Data successfully
                      </PrimaryText>
                    ) : (
                      <PrimaryText
                        style={{
                          color:
                            allCategoriesCopy?.length > 0
                              ? colors.buttonText
                              : colors.primaryText,
                        }}>
                        Sync Expense Data
                      </PrimaryText>
                    )}
                  </View>
                </TouchableOpacity>
              ) : null}
              {allData?.debtors.length !== 0 ? (
                <TouchableOpacity
                  disabled={debtorsCopy?.length > 0}
                  onPress={populate}>
                  <View
                    style={[
                      styles.settingsContainer,
                      {
                        backgroundColor:
                          debtorsCopy?.length > 0
                            ? colors.accentGreen
                            : colors.containerColor,
                        borderColor: colors.secondaryContainerColor,
                        marginBottom: '3%',
                      },
                    ]}>
                    <Icon
                      name={'credit-card-sync-outline'}
                      size={25}
                      color={
                        debtorsCopy?.length > 0
                          ? colors.buttonText
                          : colors.primaryText
                      }
                      type={'MaterialCommunityIcons'}
                    />
                    {debtorsCopy?.length > 0 ? (
                      <PrimaryText
                        style={{
                          fontSize: 13,
                          color:
                            debtorsCopy?.length > 0
                              ? colors.buttonText
                              : colors.primaryText,
                        }}>
                        Synced Debt Data successfully
                      </PrimaryText>
                    ) : (
                      <PrimaryText
                        style={{
                          color:
                            debtorsCopy?.length > 0
                              ? colors.buttonText
                              : colors.primaryText,
                        }}>
                        Sync Debt Data
                      </PrimaryText>
                    )}
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>
        <View style={{marginBottom: '10%'}}>
          <PrimaryButton
            onPress={handleDataSubmit}
            colors={colors}
            buttonTitle={'Continue'}
            disabled={isDisable()}
          />
        </View>
      </PrimaryView>
      <CustomToast
        visible={isStorageModalVisible}
        message={
          'You need to manually give permission for the storage to upload your data'
        }
        type="warning"
        onOk={handleAccessStorageOk}
        onCancel={handleAccessStorageCancel}
      />
    </>
  );
};

export default ExistingUserScreen;
