import request from '@/utils/request'
import { baseUrl } from '@/settings'

export function fetchList(data) {
  return request({
    url: `${baseUrl}/rooms`,
    method: 'post',
    data
  })
}

export function fetchRoom(data) {
  return request({
    url: `${baseUrl}/rooms/${data}`,
    method: 'post',
    data
  })
}

export function createRoom(data) {
  return request({
    url: 'http://xxxxx/rooms',
    method: 'post',
    data
  })
}

export function updateRoom(id, data) {
  return request({
    url: `http://xxxxx/rooms/${id}`,
    method: 'put',
    data
  })
}

export function deleteRoom(id) {
  return request({
    url: `http://xxxxx/rooms/${id}`,
    method: 'delete'
  })
}