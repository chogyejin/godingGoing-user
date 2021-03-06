import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
} from 'native-base';
import {
  HomeScreens,
  HomeStackParamList,
} from '../../navigators/HomeStackNavigators';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationActions } from 'react-navigation';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

type DetailsScreenNavigationProps = StackNavigationProp<
  HomeStackParamList,
  HomeScreens.Details
>;

// ~/src/navigators/HomeStackNavigators/index.tsx 에서 2번 각 스크린 마다 필요한 파라미터 타입 정의해줄 때 Details 스크린에 필요한 props 로 지정해줬었음.
export type DetailsParams = {
  // DetailsScreen 에는 symbol 이라는 이름의 string 타입의 파라미터가 필요하다.
};

// DetailsScreen Props 의 타입들을 지정. (리액트에서 proptypes 지정하는 것 처럼)
interface DetailsScreenProps {
  route: { params: DetailsParams }; // 루트의 파라미터로 방금 지정해준 DetailsParams 타입이 온다.
  navigation: DetailsScreenNavigationProps;
}

interface IUser {
  name: string;
  nickName: string;
  school: {
    name: string;
  };
}

const styles = StyleSheet.create({
  btnLoginContainer: {
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#dae7ed',
  },
  foodContainer: {
    marginBottom: 30,
  },
  txtSignupScreenContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
    flex: 1,
  },
  tab: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const DetailsScreen: React.FunctionComponent<DetailsScreenProps> = (props) => {
  const { navigation, route } = props;
  const { params } = route;
  const [schoolFoods, setSchoolFoods] = useState<Array<{ DDISH_NM: string }>>(
    [],
  );
  const [schoolID, setSchoolID] = useState<string>('');
  const [user, setUser] = useState<IUser>({
    name: '',
    nickName: '',
    school: {
      name: '',
    },
  });

  useEffect(() => {
    async function getMySchoolID() {
      if (schoolID) {
        return;
      }

      const asyncSchoolID = await AsyncStorage.getItem('schoolID');
      if (!asyncSchoolID) {
        return;
      }
      setSchoolID(asyncSchoolID);
    }

    getMySchoolID();
  });

  useEffect(() => {
    async function getSchoolFoods() {
      const result = await axios.get('http://localhost:4000/api/schoolFoods', {
        params: {
          date: new Date().toISOString(),
          schoolID,
        },
      });
      const userID = await AsyncStorage.getItem('userID');
      const {
        data: { user },
      } = await axios.get('http://localhost:4000/api/user', {
        params: {
          id: userID,
        },
      });
      if (result) {
        setUser(user);
        setSchoolFoods(result.data.schoolFoods);
      }
    }
    getSchoolFoods();
  }, [schoolID]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.txtSignupScreenContainer}>
        <div
          style={{
            border: 'solid black 1px',
            padding: '8px',
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <div>
              <div>
                <Text>
                  <b>이름</b>: {user.name}
                </Text>
              </div>
              <div>
                <Text>
                  <b>닉네임</b>: {user.nickName}
                </Text>
              </div>
              <div>
                <Text>
                  <b>학교</b>: {user.school.name}
                </Text>
              </div>
            </div>

            <div>
              <Image
                style={{ height: 100, width: 100 }}
                source={require('../ProfileScreen/profile.png')}
              />
            </div>
          </div>
          <div>
            <Image
              style={{ marginTop: '8px', height: 50, width: '100%' }}
              source={require('../ProfileScreen/barcode.png')}
            />
          </div>
        </div>

        <Text
          style={{
            borderWidth: 1,
            marginTop: '32px',
          }}>
          <div
            style={{
              textAlign: 'center',
              fontSize: '24px',
            }}>
            급식표
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '16px',
            }}>
            {schoolFoods.map((schoolFood, index) => (
              <Text key={index}>
                <table style={{ border: 'solid black 1px' }}>
                  <thead>
                    <tr>
                      <td
                        style={{
                          borderBottom: 'solid black 2px',
                          textAlign: 'center',
                        }}>
                        {index === 0 ? '점심' : '저녁'}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolFood.DDISH_NM.split('<br/>').map((menu) => (
                      <tr key={menu}>
                        <td style={{ padding: '4px' }}>
                          {menu.replace(/[0-9]/g, '').replace(/["."]/g, '')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <br />
              </Text>
            ))}
          </div>
        </Text>
      </View>
      <View>
        <View style={styles.tab}>
          <FooterTab>
            <Button
              onPress={() => navigation.navigate(HomeScreens.Details, {})}>
              <Icon name="home" />
            </Button>
            <Button onPress={() => navigation.navigate(HomeScreens.Board, {})}>
              <Icon name="reader-outline" />
            </Button>
            <Button onPress={() => navigation.navigate(HomeScreens.Etc, {})}>
              <Icon name="grid-outline" />
            </Button>
            <Button
              onPress={() => navigation.navigate(HomeScreens.MessageList, {})}>
              <Icon name="chatbox-outline" />
            </Button>
            <Button
              onPress={() => navigation.navigate(HomeScreens.Profile, {})}>
              <Icon name="person" />
            </Button>
          </FooterTab>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default DetailsScreen;
