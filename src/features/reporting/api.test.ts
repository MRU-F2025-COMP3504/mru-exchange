import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/utils';
import { UserReporting } from '@features/reporting';

describe('User Reporting', () => {
  it('return user reports from reporter', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi
            .fn()
            .mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const reporter = { supabase_id: 'abc123' };
    const query = UserReporting.getByReporter(reporter);
    const result = await query;

    expect(result.ok, 'getByReporter() failed').toBe(true);
  });

  it('return reported users', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi
            .fn()
            .mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const reported = { supabase_id: 'abc123' };
    const query = UserReporting.getByReported(reported);
    const result = await query;

    expect(result.ok, 'getByReported() failed').toBe(true);
  });

  it('create a user report', () => {
    const create = UserReporting.create();
    const form = new FormData();

    form.set('description', '123abc');

    expect(create.description(form).ok, 'create.description() invalid').toBe(
      true,
    );

    form.set('description', '');

    expect(create.description(form).ok, 'create.description() valid').toBe(
      false,
    );

    form.append('link', 'reports/user.txt');
    form.append('link', '/reports/user.txt');
    form.append('link', './reports/user.txt');
    form.append('link', '../reports/user.txt');
    form.append('link', '../../reports/user.txt');

    expect(create.link(form).ok, 'create.description() invalid').toBe(true);

    form.set('link', 'reports/user.jpg');

    expect(create.link(form).ok, 'create.description() valid').toBe(false);
  });

  it('remove user reports', async () => {
    mockQuery({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            select: vi
              .fn()
              .mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const reporter = { supabase_id: 'abc123' };
    const reports = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = UserReporting.remove(reporter, reports);
    const result = await query;

    expect(result.ok, 'remove() failed').toBe(true);
  });

  it('close user reports', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            select: vi
              .fn()
              .mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const reporter = { supabase_id: 'abc123' };
    const reports = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = UserReporting.close(reporter, reports);
    const result = await query;

    expect(result.ok, 'close() failed').toBe(true);
  });

  it('open user reports', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            select: vi
              .fn()
              .mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const reporter = { supabase_id: 'abc123' };
    const reports = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = UserReporting.open(reporter, reports);
    const result = await query;

    expect(result.ok, 'open() failed').toBe(true);
  });

  it('set/change description', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
          }),
        }),
      }),
    });

    const report = {
      id: 0,
      description: 'this is a description',
    };
    const query = UserReporting.modify(report);
    const result = await query;

    expect(result.ok, 'setDescription() failed').toBe(true);
  });
});
