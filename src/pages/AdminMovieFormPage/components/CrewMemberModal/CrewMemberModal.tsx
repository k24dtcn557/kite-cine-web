import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import { movieService } from "../../../../services/movie.service";
import {
  CrewPersonDto,
  CrewMemberDto,
  CrewRole,
  CREW_ROLE_LABELS,
} from "../../../../types/movie";
import { getApiErrorMessage } from "../../../../types/api";
import styles from "../MovieForm/MovieForm.module.css";

interface CrewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId?: number;
  onAddSuccess: (member: CrewMemberDto) => void;
}

const CrewMemberModal: React.FC<CrewMemberModalProps> = ({
  isOpen,
  onClose,
  movieId,
  onAddSuccess,
}) => {
  const [isAddingCrewMember, setIsAddingCrewMember] = useState(false);
  const [newCrewRole, setNewCrewRole] = useState<CrewRole>(CrewRole.DIRECTOR);
  const [newCrewName, setNewCrewName] = useState("");
  const [selectedCrewPersonId, setSelectedCrewPersonId] = useState<
    number | null
  >(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<CrewPersonDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const [isCreatePersonModalOpen, setIsCreatePersonModalOpen] = useState(false);
  const [isCreatingPerson, setIsCreatingPerson] = useState(false);
  const [personName, setPersonName] = useState("");
  const [personAvatar, setPersonAvatar] = useState("");
  const [personBio, setPersonBio] = useState("");
  const [personDob, setPersonDob] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await movieService.searchCrewPersons({
          page: 0,
          size: 10,
          keyword: searchTerm,
        });
        setSearchResults(response?.data || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCreateCrewPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) return;

    setIsCreatingPerson(true);
    try {
      const newPerson = await movieService.createCrewPerson({
        name: personName,
        avatar: personAvatar,
        bio: personBio,
        dob: personDob,
      });
      toast.success("Tạo thành viên đoàn phim thành công!");
      setNewCrewName(newPerson.name);
      setSearchTerm(newPerson.name);
      setSelectedCrewPersonId(newPerson.id);
      setSearchResults([newPerson]);
      setIsCreatePersonModalOpen(false);
      setPersonName("");
      setPersonAvatar("");
      setPersonBio("");
      setPersonDob("");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsCreatingPerson(false);
    }
  };

  const handleAddCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrewName.trim()) return;

    if (!movieId) {
      toast.error("Vui lòng lưu phim trước khi thêm thành viên đoàn phim.");
      return;
    }

    if (!selectedCrewPersonId) {
      toast.error("Vui lòng chọn hoặc tạo một thành viên đoàn phim.");
      return;
    }

    setIsAddingCrewMember(true);
    try {
      await movieService.addCrewMember({
        movieId,
        crewPersonId: selectedCrewPersonId,
        role: newCrewRole,
      });
      toast.success("Thêm thành viên vào phim thành công!");

      const person = searchResults.find((p) => p.id === selectedCrewPersonId);

      onAddSuccess({
        crewPersonId: selectedCrewPersonId,
        role: newCrewRole,
        name: person?.name || newCrewName,
        avatar: person?.avatar || "",
      });

      setNewCrewName("");
      setSearchTerm("");
      setSelectedCrewPersonId(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Lỗi khi thêm thành viên."));
    } finally {
      setIsAddingCrewMember(false);
    }
  };

  const handleClose = () => {
    setNewCrewName("");
    setSearchTerm("");
    setSelectedCrewPersonId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Thêm thành viên đoàn phim</h3>
            <form onSubmit={handleAddCrew} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Vai trò</label>
                <select
                  className={styles.input}
                  value={newCrewRole}
                  onChange={(e) => setNewCrewRole(e.target.value as CrewRole)}
                >
                  {Object.values(CrewRole).map((role) => (
                    <option key={role} value={role}>
                      {CREW_ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Tên thành viên</label>
                <div className={styles.addPersonRow}>
                  <div className={styles.comboboxContainer} ref={comboboxRef}>
                    <input
                      type="text"
                      className={styles.input}
                      style={{ width: "100%" }}
                      placeholder="Gõ tên để tìm..."
                      value={newCrewName}
                      onChange={(e) => {
                        setNewCrewName(e.target.value);
                        setSearchTerm(e.target.value);
                        setSelectedCrewPersonId(null);
                        setShowDropdown(true);
                      }}
                      onFocus={() => {
                        if (newCrewName.trim()) setShowDropdown(true);
                      }}
                    />
                    {showDropdown && newCrewName.trim() && (
                      <ul className={styles.dropdownMenu}>
                        {isSearching ? (
                          <li className={styles.dropdownLoading}>
                            Đang tìm kiếm...
                          </li>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((person) => (
                            <li
                              key={person.id}
                              className={styles.dropdownItem}
                              onClick={() => {
                                setNewCrewName(person.name);
                                setSearchTerm(person.name);
                                setSelectedCrewPersonId(person.id);
                                setShowDropdown(false);
                              }}
                            >
                              {person.name}
                            </li>
                          ))
                        ) : (
                          <li className={styles.dropdownEmpty}>
                            Không tìm thấy. Bấm "+" để tạo mới.
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.addPersonBtn}
                    onClick={() => setIsCreatePersonModalOpen(true)}
                    title="Tạo người mới"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleClose}
                  disabled={isAddingCrewMember}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={
                    !newCrewName.trim() ||
                    !selectedCrewPersonId ||
                    isAddingCrewMember
                  }
                >
                  {isAddingCrewMember ? "Đang thêm..." : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )}

      {isCreatePersonModalOpen &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Tạo người mới</h3>
              <form onSubmit={handleCreateCrewPerson} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Họ và tên (*)</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="vd: Christopher Nolan"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Đường dẫn ảnh đại diện</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://..."
                    value={personAvatar}
                    onChange={(e) => setPersonAvatar(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={personDob}
                    onChange={(e) => setPersonDob(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Tiểu sử</label>
                  <textarea
                    rows={3}
                    className={styles.input}
                    placeholder="Thông tin ngắn gọn..."
                    value={personBio}
                    onChange={(e) => setPersonBio(e.target.value)}
                  />
                </div>
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setIsCreatePersonModalOpen(false)}
                    disabled={isCreatingPerson}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={!personName.trim() || isCreatingPerson}
                  >
                    {isCreatingPerson ? "Đang tạo..." : "Tạo"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default CrewMemberModal;
