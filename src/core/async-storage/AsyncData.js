import AsyncStorage from '@react-native-async-storage/async-storage';

export async function GetKey(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {}
}

export async function SetKey(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {}
}

export async function RemoveKey(key) {
  try {
    await AsyncStorage.multiRemove(key);
  } catch (error) {}
}

export async function ClearKeys() {
  try {
    await AsyncStorage.clear();
  } catch (error) {}
}
