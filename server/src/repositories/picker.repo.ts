import { Picker, IPicker } from '../models/Picker.js';

export class PickerRepository {
  async findAll(storeId?: string): Promise<IPicker[]> {
    const filter = storeId ? { storeId, active: true } : { active: true };
    return Picker.find(filter).sort({ name: 1 }).lean<IPicker[]>();
  }

  async findByPickerId(pickerId: string): Promise<IPicker | null> {
    return Picker.findOne({ pickerId }).lean<IPicker | null>();
  }

  async count(storeId?: string): Promise<number> {
    const filter = storeId ? { storeId, active: true } : { active: true };
    return Picker.countDocuments(filter);
  }
}

export const pickerRepo = new PickerRepository();
