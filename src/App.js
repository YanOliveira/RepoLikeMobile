import React, { useState, useEffect } from "react";
import api from "./services/api";
import Repository from "./components/Repository";

import { SafeAreaView, FlatList, StatusBar, StyleSheet } from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("repositories").then(({ data }) => {
      if (data.length > 0) {
        setRepositories(data);
      }
    });
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    if (response.status === 200) {
      const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
      if (repositoryIndex >= 0) {
        let newRepositories = [...repositories];
        newRepositories[repositoryIndex] = response.data;
        setRepositories(newRepositories);
      }
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          extraData={repositories}
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item }) => (
            <Repository
              repository={item}
              handleLikeRepository={() => handleLikeRepository(item.id)}
            />
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
});
