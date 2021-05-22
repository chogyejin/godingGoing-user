import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {
  HomeScreens,
  HomeStackParamList,
} from '../../navigators/HomeStackNavigators';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'native-base';

type BoardScreenNavigationProps = StackNavigationProp<
  HomeStackParamList,
  HomeScreens.Board
>;

export type BoardParams = {};

interface BoardScreenProps {
  navigation: BoardScreenNavigationProps;
}

interface Post {
  id: string;
  userID: string;
  schoolID: string;
  title: string;
}
const BoardScreen: React.FunctionComponent<BoardScreenProps> = (props) => {
  const { navigation } = props;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState<Boolean>(true);

  const movePost = (postID: string) => () => {
    navigation.navigate(HomeScreens.BoardDetail, { postID });
  };

  const onMoveCreationPage = () => {
    navigation.navigate(HomeScreens.BoardCreation);
  };

  useEffect(() => {
    async function getPost() {
      const myShcoolID = await AsyncStorage.getItem('schoolID');
      const result = await axios.get('http://localhost:4000/api/posts', {
        params: {
          schoolID: myShcoolID,
        },
      });

      if (result.data) {
        const existsPosts = result.data.posts.length > 0;
        if (isFirstLoad && existsPosts) {
          setIsFirstLoad(false);
          console.log(result.data.posts);
          setPosts(result.data.posts || []);
        }
      } else {
        console.log('실패');
      }
    }
    getPost();
  }, [posts]);

  return (
    <SafeAreaView>
      <Text style={styles.ScreenTitle}>학교 게시판 테스트</Text>
      <View>
        <Button onPress={onMoveCreationPage}>
          <Text>게시글 작성</Text>
        </Button>
      </View>
      <View style={styles.container}>
        {posts.map((post) => (
          <Text onPress={movePost(post.id)} key={post.id}>
            {post.title}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  ScreenTitle: {
    alignSelf: 'center',
    fontSize: 30,
  },
  BoardTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: 'white',
    flexDirection: 'column',
    fontSize: 20,
    backgroundColor: 'grey',
    borderRadius: 10,
    padding: 10,
  },
});

export default BoardScreen;
