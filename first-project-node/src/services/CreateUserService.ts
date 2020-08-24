import User from '../models/User';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs'

interface Request{
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({name, email, password}: Request): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExiste = await userRepository.findOne({
      where: { email },
    });

    if(checkUserExiste){
      throw new Error('Email address already user.');
    }

    const hashedPassord = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassord
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;