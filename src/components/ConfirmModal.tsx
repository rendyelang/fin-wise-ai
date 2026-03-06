import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({ visible, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-white w-full rounded-[28px] p-6 shadow-xl">
          {/* Icon Header */}
          <View className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${isDestructive ? "bg-red-50" : "bg-blue-50"}`}>
            <Ionicons name={isDestructive ? "trash-outline" : "alert-circle-outline"} size={28} color={isDestructive ? "#ef4444" : "#3b82f6"} />
          </View>

          {/* Text Content */}
          <Text className="text-xl font-bold text-gray-900 mb-2">{title}</Text>
          <Text className="text-gray-500 text-base leading-6 mb-8">{message}</Text>

          {/* Action Buttons */}
          <View className="flex-row items-center justify-between space-x-3">
            <TouchableOpacity onPress={onCancel} className="flex-1 bg-gray-100 py-4 rounded-2xl items-center" activeOpacity={0.8}>
              <Text className="text-gray-600 font-bold text-base">{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} className={`flex-1 py-4 rounded-2xl items-center shadow-sm ${isDestructive ? "bg-red-500" : "bg-blue-600"}`} activeOpacity={0.8}>
              <Text className="text-white font-bold text-base">{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
