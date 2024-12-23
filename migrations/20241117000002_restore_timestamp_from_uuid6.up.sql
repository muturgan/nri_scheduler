create or replace function restore_timestamp_from_uuid_v6(uuid_value uuid) returns timestamp with time zone as $$
declare
	v_time double precision := null;
	hex_str varchar := null;
	v_gregorian_t_hex_a varchar := null;
	v_gregorian_t_hex_b varchar := null;
	v_gregorian_t bigint := null;
	c_epoch double precision := 12219292800;
	c_100ns_factor double precision := 10^7;
	c_version bigint := x'0000000000006000'::bigint;
begin
	hex_str := replace(uuid_value::varchar, '-', '');
	v_gregorian_t_hex_a := substring(hex_str from 1 for 12);
	v_gregorian_t_hex_b := substring(hex_str from 13 for 4);
	v_gregorian_t := (('x' || v_gregorian_t_hex_a)::bit(48)::bigint << 12) | (('x' || v_gregorian_t_hex_b)::bit(16)::bigint & 4095);
	v_gregorian_t := v_gregorian_t & ~(c_version & 4095);
	v_time := (v_gregorian_t / c_100ns_factor) - c_epoch;
	return to_timestamp(v_time);
end $$ language plpgsql;
