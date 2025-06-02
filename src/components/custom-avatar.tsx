import { getNameInitials } from '@/utilities'
import { Avatar as AntdAvatar, AvatarProps } from 'antd'

interface CustomAvatarProps extends AvatarProps {
  name?: string
}

const CustomAvatar = ({ name, style, ...rest }: CustomAvatarProps) => {

  return (
    <AntdAvatar
      alt={name}
      size='small'
      style={{
        backgroundColor: '#87d068',
        display: 'flex',
        alignItems: 'center',
        border: 'none',
        ...style
      }}
      {...rest}
    >
      {getNameInitials(name || '')}
    </AntdAvatar>
  )
}

export default CustomAvatar
